using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly PoSDbContext _db;

        public AppointmentService(PoSDbContext db)
        {
            _db = db;
        }

        public async Task<List<AppointmentDto>> GetPendingAppointmentsAsync(Guid organizationId)
        {
            var appts = await _db.Appointments
                .AsNoTracking()
                .Include(a => a.Employee)
                .Include(a => a.MenuService)
                .Where(a =>
                    a.OrganizationId == organizationId &&
                    a.PaymentStatus == PaymentEnum.pending)
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            return appts.Select(a => new AppointmentDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Username,

                MenuServiceId = a.MenuServiceId,
                ServiceName = a.MenuService.Name,

                StartTime = a.StartTime,
                EndTime = a.EndTime,

                CustomerName = a.CustomerName,
                CustomerPhone = a.CustomerPhone,
                ExtraInfo = a.ExtraInfo,

                OrganizationId = a.OrganizationId,
                PaymentStatus = a.PaymentStatus
            }).ToList();
        }


        // -------------------------
        // GET APPOINTMENTS BY DATE
        // -------------------------
        public async Task<List<AppointmentDto>> GetAppointmentsForDateAsync(Guid organizationId, DateTime date)
        {
            var appts = await _db.Appointments
                .AsNoTracking()
                .Include(a => a.Employee)
                .Include(a => a.MenuService)
                .Where(a =>
                    a.OrganizationId == organizationId &&
                    a.StartTime.Date == date.Date)
                .ToListAsync();

            return appts.Select(a => new AppointmentDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Username,

                MenuServiceId = a.MenuServiceId,
                ServiceName = a.MenuService.Name,

                StartTime = a.StartTime,
                EndTime = a.EndTime,

                CustomerName = a.CustomerName,
                CustomerPhone = a.CustomerPhone,
                ExtraInfo = a.ExtraInfo,
                OrganizationId = a.OrganizationId,
                PaymentStatus = a.PaymentStatus
            }).ToList();
        }

        public async Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto)
        {
            Organization? org = await _db.Organizations.FindAsync(dto.OrganizationId);
            var emp = await _db.Employees
            .Include(e => e.Organizations)
            .FirstOrDefaultAsync(e =>
                e.Username.ToLower() == dto.EmployeeName.ToLower() &&
                e.Organizations.Any(o => o.Id == dto.OrganizationId))
            ?? throw new Exception("Employee not found in this organization.");

            var svc = await _db.MenuServices
                .FirstOrDefaultAsync(s =>
                    s.OrganizationId == dto.OrganizationId &&
                    s.Name.ToLower() == dto.ServiceName.ToLower())
                ?? throw new Exception("Service not found.");

            var end = dto.StartTime.AddMinutes(svc.Duration);

            var appt = new Appointment
            {
                Id = Guid.NewGuid(),
                OrganizationId = dto.OrganizationId,
                EmployeeId = emp.Id,
                MenuServiceId = svc.Id,
                StartTime = dto.StartTime,
                EndTime = end,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                ExtraInfo = dto.ExtraInfo,
                Timestamp = DateTime.UtcNow,
                Employee = emp,
                MenuService = svc,
                Organization = org!,
                PaymentStatus = PaymentEnum.pending
            };

            _db.Appointments.Add(appt);
            await _db.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appt.Id,
                EmployeeId = emp.Id,
                EmployeeName = emp.Username,
                MenuServiceId = svc.Id,
                ServiceName = svc.Name,
                StartTime = appt.StartTime,
                EndTime = appt.EndTime,
                CustomerName = appt.CustomerName,
                CustomerPhone = appt.CustomerPhone,
                ExtraInfo = appt.ExtraInfo,
                OrganizationId = appt.OrganizationId,
                PaymentStatus = PaymentEnum.pending
            };
        }
        public async Task<AppointmentDto> UpdateAsync(Guid id, CreateAppointmentDto dto)
        {
            var appt = await _db.Appointments
                .FirstOrDefaultAsync(a => a.Id == id)
                ?? throw new Exception("Appointment not found.");

            var emp = await _db.Employees
                .Include(e => e.Organizations)
                .FirstOrDefaultAsync(e =>
                    e.Username.ToLower() == dto.EmployeeName.ToLower() &&
                    e.Organizations.Any(o => o.Id == dto.OrganizationId))
                ?? throw new Exception("Employee not found in this organization.");

            var svc = await _db.MenuServices
                .FirstOrDefaultAsync(s =>
                    s.OrganizationId == dto.OrganizationId &&
                    s.Name.ToLower() == dto.ServiceName.ToLower())
                ?? throw new Exception("Service not found.");

            appt.EmployeeId = emp.Id;
            appt.MenuServiceId = svc.Id;
            appt.StartTime = dto.StartTime;
            appt.EndTime = dto.StartTime.AddMinutes(svc.Duration);
            appt.CustomerName = dto.CustomerName;
            appt.CustomerPhone = dto.CustomerPhone;
            appt.ExtraInfo = dto.ExtraInfo;

            await _db.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appt.Id,
                EmployeeId = emp.Id,
                EmployeeName = emp.Username,
                MenuServiceId = svc.Id,
                ServiceName = svc.Name,
                StartTime = appt.StartTime,
                EndTime = appt.EndTime,
                CustomerName = appt.CustomerName,
                CustomerPhone = appt.CustomerPhone,
                ExtraInfo = appt.ExtraInfo
            };
        }

        // -------------------------
        // DELETE
        // -------------------------
        public async Task<bool> DeleteAsync(Guid id)
        {
            var appt = await _db.Appointments.FindAsync(id);
            if (appt == null) return false;

            _db.Appointments.Remove(appt);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
