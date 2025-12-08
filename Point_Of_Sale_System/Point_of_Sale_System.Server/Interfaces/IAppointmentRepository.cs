using Point_of_Sale_System.Server.Models;
namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<Schedule> CreateAsync(Schedule appointment);
        Task<List<Schedule>> GetForEmployeeAsync(Guid employeeId, DateOnly date);
        Task<Schedule?> GetByIdAsync(Guid id);
    }

}