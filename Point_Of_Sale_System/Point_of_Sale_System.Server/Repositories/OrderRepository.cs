using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly PoSDbContext _context;

        public OrderRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order?> GetOrderAsync(Guid id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Variation)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<bool> AddItemsToOrderAsync(List<OrderItem> items)
        {  
            foreach (var item in items)
            {
                var menuItem = await _context.MenuItems
                    .Include(m => m.Tax)
                    .FirstOrDefaultAsync(m => m.Id == item.MenuItemId);
                
                if (menuItem == null) return false;

                if (item.VariationId != null)
                {
                    var parentItem = await _context.OrderItems
                        .FirstOrDefaultAsync(oi => oi.OrderId == item.OrderId && oi.MenuItemId == item.MenuItemId);
                    
                    if (parentItem == null)
                    {
                        parentItem = _context.OrderItems.Local
                            .FirstOrDefault(oi =>
                                oi.OrderId == item.OrderId &&
                                oi.MenuItemId == item.MenuItemId);
                    }

                    if (parentItem == null) return false;

                    item.ParentOrderItemId = parentItem.Id;
                    
                    var variationItem = await _context.Variations
                        .FirstOrDefaultAsync(v => v.Id == item.VariationId);
                    if (variationItem == null) return false;
                    item.Price = variationItem.Price;
                    item.Name = variationItem.Name;
                }
                else
                {
                    item.Name = menuItem.Name;
                    item.Price = menuItem.Price;
                    if (menuItem?.Tax != null)
                    {
                        item.TaxName = menuItem.Tax.Name;
                        if (menuItem.Tax.NumberType == NumberTypeEnum.flat) // flat
                        {
                            item.Tax = menuItem.Tax.Amount;
                        }
                        else if (menuItem.Tax.NumberType == NumberTypeEnum.percentage) // percentage
                        {
                            item.Tax = item.Price * (menuItem.Tax.Amount / 100);
                        }
                    }
                }
                
                _context.OrderItems.Add(item);
            };

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckMenuItemOrVariationExistsAsync(Guid menuItemId, Guid? variationId, Guid orderId, bool isParent)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return false;

            var menuItemExists = await _context.MenuItems.AnyAsync(mi => mi.Id == menuItemId && mi.OrganizationId == order.OrganizationId);
            if (!menuItemExists) return false;

            if (isParent)
            {
                return true;
            }
            
            var variationExists = await _context.Variations.AnyAsync(v => v.Id == variationId && v.MenuItemId == menuItemId);
            return variationExists;
        }
    }
}
