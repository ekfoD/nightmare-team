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
            _context.Entry(menuItem).State = EntityState.Modified;
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
