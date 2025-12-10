using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<List<Appointment>> GetByDateAsync(Guid organizationId, DateTime date);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<Appointment?> GetByIdAsync(Guid id);
        Task<bool> DeleteAsync(Guid id);
    }
}
