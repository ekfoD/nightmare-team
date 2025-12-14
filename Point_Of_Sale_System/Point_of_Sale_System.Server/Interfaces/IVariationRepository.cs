using Point_of_Sale_System.Server.Models.Entities.MenuBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IVariationRepository
    {
        Task<IEnumerable<Variation>> GetVariationsAsync(Guid menuItemId);
        Task<Variation?> GetVariationAsync(Guid id);
        Task<Variation> AddVariationAsync(Variation variation);
        Task UpdateVariationAsync(Variation variation);
        Task DeleteVariationAsync(Guid id);
        Task<bool> VariationExistsAsync(Guid id);
    }
}
