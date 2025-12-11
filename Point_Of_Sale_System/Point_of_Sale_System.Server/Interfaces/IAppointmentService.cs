using Point_of_Sale_System.Server.DTOs;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDto>> GetAppointmentsForDateAsync(Guid organizationId, DateTime date);
        Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto);
        Task<AppointmentDto> UpdateAsync(Guid id, CreateAppointmentDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
