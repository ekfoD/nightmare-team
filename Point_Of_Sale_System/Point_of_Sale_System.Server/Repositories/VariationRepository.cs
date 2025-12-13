using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;

namespace Point_of_Sale_System.Server.Repositories
{
    public class VariationRepository : IVariationRepository
    {
        private readonly PoSDbContext _context;

        public VariationRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Variation>> GetVariationsAsync()
        {
            return await _context.Variations.ToListAsync();
        }

        public async Task<Variation?> GetVariationAsync(Guid id)
        {
            return await _context.Variations.FindAsync(id);
        }

        public async Task<Variation> AddVariationAsync(Variation variation)
        {
            _context.Variations.Add(variation);
            await _context.SaveChangesAsync();
            return variation;
        }

        public async Task UpdateVariationAsync(Variation variation)
        {
            _context.Entry(variation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVariationAsync(Guid id)
        {
            var variation = await _context.Variations.FindAsync(id);
            if (variation != null)
            {
                _context.Variations.Remove(variation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VariationExistsAsync(Guid id)
        {
            return await _context.Variations.AnyAsync(e => e.Id == id);
        }
    }
}
