using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Repositories
{
    public class MenuServiceRepository : IMenuServiceRepository
    {
        // temporary in-memory storage
        public static readonly List<MenuService> _services = new();

        public Task<MenuService?> GetByIdAsync(Guid id)
        {
            return Task.FromResult(_services.FirstOrDefault(s => s.Id == id));
        }

        public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
        {
            var result = _services.Where(s => s.OrganizationId == organizationId);
            return Task.FromResult(result);
        }

        // Optional: helper to add test data when DB doesn't exist yet
        public Task<MenuService> AddAsync(MenuService service)
        {
            _services.Add(service);
            return Task.FromResult(service);
        }
    }
}
