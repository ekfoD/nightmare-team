using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IMenuServiceRepository
    {
        Task<MenuService?> GetByIdAsync(Guid id);
        Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId);
    }
}
