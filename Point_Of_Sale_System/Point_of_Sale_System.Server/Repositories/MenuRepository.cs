using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;

namespace Point_of_Sale_System.Server.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly PoSDbContext _context;

        public MenuRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MenuItem>> GetMenuItemsAsync(Guid organizationId)
        {
            return await _context.MenuItems
                .Where(x => x.OrganizationId == organizationId)
                .ToListAsync();
        }

        public async Task<MenuItem?> GetMenuItemAsync(Guid id)
        {
            return await _context.MenuItems
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<MenuItem> AddMenuItemAsync(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task UpdateMenuItemAsync(MenuItem menuItem)
        {
            var existingMenuItem = await _context.MenuItems
                .Include(m => m.Variations)
                .FirstOrDefaultAsync(m => m.Id == menuItem.Id);

            if (existingMenuItem == null)
                throw new Exception("Menu item not found");

            _context.Entry(existingMenuItem).CurrentValues.SetValues(menuItem);

            foreach (var variation in menuItem.Variations)
            {
                var trackedVariation = existingMenuItem.Variations
                    .FirstOrDefault(v => v.Id == variation.Id);

                if (trackedVariation != null)
                {
                    _context.Entry(trackedVariation).CurrentValues.SetValues(variation);
                }
                else
                {
                    variation.MenuItemId = existingMenuItem.Id;

                    _context.Variations.Add(variation); 
                }
            }

            foreach (var trackedVariation in existingMenuItem.Variations.ToList())
            {
                if (!menuItem.Variations.Any(v => v.Id == trackedVariation.Id))
                {
                    _context.Variations.Remove(trackedVariation);
                }
            }

            await _context.SaveChangesAsync();
        }



        public async Task DeleteMenuItemAsync(Guid id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem != null)
            {
                _context.MenuItems.Remove(menuItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> MenuItemExistsAsync(Guid id)
        {
            return await _context.MenuItems.AnyAsync(e => e.Id == id);
        }
    }
}
