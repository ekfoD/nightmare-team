using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.DTOs;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IPaymentRepository
    {
        Task<bool> PayOrderAsync(Guid orderId, PaymentDto dto);
        Task<IEnumerable<Order>> GetAllOrdersAsync(Guid organizationId);
        Task<OrderDetailsResponseDto?> GetOrderDetailsAsync(Guid orderId);
        Task<bool> RefundPaymentAsync(Guid orderId);
    }
}
