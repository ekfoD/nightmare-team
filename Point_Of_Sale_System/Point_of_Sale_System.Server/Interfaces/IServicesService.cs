using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IServicesService
    {
        Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId);

        Task<IEnumerable<object>> GetActiveForOrganizationAsync(Guid organizationId);
        Task<IEnumerable<MenuServiceDto>> GetFullDtosForOrganizationAsync(Guid organizationId);

        Task CreateAsync(CreateMenuServiceDto dto);
        Task<MenuServiceDto?> UpdateAsync(Guid id, CreateMenuServiceDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
