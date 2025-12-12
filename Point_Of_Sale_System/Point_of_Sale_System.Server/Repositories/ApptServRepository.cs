using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

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
    public class MenuServiceRepository : IMenuServiceRepository
    {
        public static readonly List<MenuService> _services = new();

        public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
        {
            var result = _services.Where(s => s.OrganizationId == organizationId);
            return Task.FromResult(result);
        }
            public Task AddAsync(MenuService service)
        {
            _services.Add(service);
            return Task.CompletedTask;
        }
    }
}
