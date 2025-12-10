using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IServicesService
    {
        Task<IEnumerable<MenuService>> GetAllAsync();
        Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId);
        Task<MenuService?> GetByIdAsync(Guid id);
    }
}