using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _apptRepo;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IMenuServiceRepository _serviceRepo;
        private readonly IOrganizationRepository _organizationRepo;

        public AppointmentService(
            IAppointmentRepository apptRepo,
            IEmployeeRepository employeeRepo,
            IMenuServiceRepository serviceRepo,
            IOrganizationRepository organizationRepo)
        {
            _apptRepo = apptRepo;
            _employeeRepo = employeeRepo;
            _serviceRepo = serviceRepo;
            _organizationRepo = organizationRepo;
        }

        public async Task<List<AppointmentDto>> GetAppointmentsForDateAsync(Guid organizationId, DateTime date)
        {
            var appts = await _apptRepo.GetByDateAsync(organizationId, date);

            var employees = _employeeRepo.GetEmployees(organizationId)
                .ToDictionary(e => e.Id, e => e.Username);

            var services = (await _serviceRepo.GetAllForOrganizationAsync(organizationId))
                .ToDictionary(s => s.Id, s => s.Name);

            return appts.Select(a => new AppointmentDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = employees.ContainsKey(a.EmployeeId) ? employees[a.EmployeeId] : null,

                MenuServiceId = a.MenuServiceId,
                ServiceName = services.ContainsKey(a.MenuServiceId) ? services[a.MenuServiceId] : null,

                StartTime = a.StartTime,
                EndTime = a.EndTime,

                CustomerName = a.CustomerName,
                CustomerPhone = a.CustomerPhone,
                ExtraInfo = a.ExtraInfo
            }).ToList();
        }

        public async Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto)
        {

            var emp = (await _employeeRepo.GetEmployeesAsync(dto.OrganizationId))
                       .FirstOrDefault(e => e.Username.Equals(dto.EmployeeName, StringComparison.OrdinalIgnoreCase))
                       ?? throw new Exception("Employee not found.");

            var svc = (await _serviceRepo.GetAllForOrganizationAsync(dto.OrganizationId))
                       .FirstOrDefault(s => s.Name.Equals(dto.ServiceName, StringComparison.OrdinalIgnoreCase))
                       ?? throw new Exception("Service not found.");


            if (emp.OrganizationId != dto.OrganizationId)
                throw new Exception("Employee does not belong to this organization.");
            
            var org = await _organizationRepo.GetByIdAsync(dto.OrganizationId);

            if (svc.OrganizationId != dto.OrganizationId)
                throw new Exception("Service does not belong to this organization.");

            var duration = svc.Duration.ToTimeSpan();
            var end = dto.StartTime.Add(duration);

            var appt = new Appointment
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                Employee = emp,              // assign navigation property
                MenuServiceId = svc.Id,
                MenuService = svc,           // assign navigation property
                OrganizationId = dto.OrganizationId,
                Organization = org,          // fetch org if needed
                StartTime = dto.StartTime,
                EndTime = end,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                ExtraInfo = dto.ExtraInfo,
                Timestamp = DateTime.UtcNow
            };

            var created = await _apptRepo.CreateAsync(appt);

            return new AppointmentDto
            {
                Id = created.Id,
                EmployeeId = created.EmployeeId,
                EmployeeName = emp.Username,

                MenuServiceId = created.MenuServiceId,
                ServiceName = svc.Name,

                StartTime = created.StartTime,
                EndTime = created.EndTime,

                CustomerName = created.CustomerName,
                CustomerPhone = created.CustomerPhone,
                ExtraInfo = created.ExtraInfo
            };
        }
    }
}
