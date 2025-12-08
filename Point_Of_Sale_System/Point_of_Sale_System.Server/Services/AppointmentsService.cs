using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Mappers;
namespace Point_of_Sale_System.Server.Services
{
    public class AppointmentService
    {
        private readonly IAppointmentRepository _repo;
        private readonly IEmployeeRepository _employeeRepo;

        public AppointmentService(
            IAppointmentRepository repo,
            IEmployeeRepository employeeRepo)
        {
            _repo = repo;
            _employeeRepo = employeeRepo;
        }

        public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto dto)
        {
            var employee = await _employeeRepo.GetByIdAsync(dto.EmployeeId);
            if (employee == null)
                throw new Exception("Employee not found.");

            var model = AppointmentMapper.ToModel(dto, employee);
            var created = await _repo.CreateAsync(model);

            return AppointmentMapper.ToDto(created);
        }

        public async Task<List<AppointmentDto>> GetAppointmentsForEmployee(
            Guid employeeId, DateOnly date)
        {
            var items = await _repo.GetForEmployeeAsync(employeeId, date);
            return items.Select(AppointmentMapper.ToDto).ToList();
        }
    }


}