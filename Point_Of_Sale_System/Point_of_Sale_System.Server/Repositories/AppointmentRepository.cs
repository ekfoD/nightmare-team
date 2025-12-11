using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        public static readonly List<Appointment> _appointments = new();

        public Task<List<Appointment>> GetByDateAsync(Guid organizationId, DateTime date)
        {
            var result = _appointments
                .Where(a => a.OrganizationId == organizationId &&
                            a.StartTime.Date == date.Date)
                .ToList();

            return Task.FromResult(result);
        }

        public Task<Appointment> CreateAsync(Appointment appointment)
        {
            _appointments.Add(appointment);
            return Task.FromResult(appointment);
        }
    
        public Task<Appointment?> GetByIdAsync(Guid id)
        {
            return Task.FromResult(_appointments.FirstOrDefault(a => a.Id == id));
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            var existing = _appointments.FirstOrDefault(a => a.Id == id);
            if (existing == null)
                return Task.FromResult(false);

            _appointments.Remove(existing);
            return Task.FromResult(true);
        }

        
    }
}
