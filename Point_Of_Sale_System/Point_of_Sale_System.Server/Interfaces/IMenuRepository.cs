using Point_of_Sale_System.Server.Models.Entities.MenuBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetMenuItemsAsync();
        Task<MenuItem?> GetMenuItemAsync(Guid id);
        Task<MenuItem> AddMenuItemAsync(MenuItem menuItem);
        Task UpdateMenuItemAsync(MenuItem menuItem);
        Task DeleteMenuItemAsync(Guid id);
        Task<bool> MenuItemExistsAsync(Guid id);
    }
}
