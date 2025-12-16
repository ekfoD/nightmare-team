using Point_of_Sale_System.Server.DTOs;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IDiscountService
    {
        Task<IEnumerable<DiscountResponseDto>> GetAllByOrganizationAsync(Guid organizationId);
        Task<DiscountResponseDto?> GetByIdAsync(Guid id);
        Task CreateAsync(CreateDiscountDto dto);
        Task UpdateAsync(Guid id, UpdateDiscountDto dto);
        Task DeleteAsync(Guid id);
    }
}
