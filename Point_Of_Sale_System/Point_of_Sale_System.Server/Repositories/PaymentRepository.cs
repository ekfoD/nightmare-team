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

        public async Task<IEnumerable<Order>> GetAllOrdersAsync(Guid organizationId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Variation)
                .Where(o => o.OrganizationId == organizationId)
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentAsync(Guid id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task<bool> RefundPaymentAsync(Guid paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;

            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
