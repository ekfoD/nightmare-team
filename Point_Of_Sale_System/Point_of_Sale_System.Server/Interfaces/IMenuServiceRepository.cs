using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IMenuServiceRepository
    {
        Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId);
        Task AddAsync(MenuService service);
    }
}
