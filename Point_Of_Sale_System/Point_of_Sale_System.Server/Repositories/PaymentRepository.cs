using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;

namespace Point_of_Sale_System.Server.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PoSDbContext _context;

        public PaymentRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<IEnumerable<Order>> GetClosedOrdersAsync(Guid organizationId)
        {
            // Orders are considered closed if they have at least one successful payment
             return await _context.Orders
                .Include(o => o.Payments)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Variation)
                .Where(o => o.OrganizationId == organizationId && 
                            o.Payments.Any(p => p.PaymentStatus == PaymentEnum.succeeded))
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentAsync(Guid id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task<bool> RefundPaymentAsync(Guid paymentId, decimal amount, RefundEnum refundStatus)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;

            payment.RefundStatus = refundStatus;
            // Potentially we could track partial refunds or update amount, 
            // but usually we just mark status or create a new refund record.
            // Requirement says "updates order information with a 'refunded' status" 
            // or "mark order as refunded". 
            // Since status is on Payment, we update Payment.

            if (refundStatus == RefundEnum.succeeded)
            {
                 payment.PaymentStatus = PaymentEnum.refunded;
            }

            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
