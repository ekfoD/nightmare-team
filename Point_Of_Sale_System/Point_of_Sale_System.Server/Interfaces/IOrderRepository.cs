using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> GetOrderAsync(Guid id);
        Task<List<OrderItem>> AddItemsToOrderAsync(List<OrderItem> items);
        Task<bool> CheckMenuItemOrVariationExistsAsync(Guid menuItemId, Guid? variationId, Guid orderId, bool isParent);
    }
}
