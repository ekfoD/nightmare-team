using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IServicesService
    {
        Task<IEnumerable<MenuService>> GetAllAsync();
        Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId);
    }
}