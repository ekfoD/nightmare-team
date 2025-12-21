using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<IEnumerable<Order>> GetClosedOrdersAsync(Guid organizationId);
        Task<Payment?> GetPaymentAsync(Guid id);
        Task<bool> RefundPaymentAsync(Guid paymentId, decimal amount, RefundEnum refundStatus);
    }
}
