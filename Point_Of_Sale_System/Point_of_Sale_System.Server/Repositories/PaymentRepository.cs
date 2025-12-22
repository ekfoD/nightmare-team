using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.DTOs;

namespace Point_of_Sale_System.Server.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PoSDbContext _context;

        public PaymentRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<bool> PayOrderAsync(Guid orderId, PaymentDto dto)
        {
            var Payment = new Payment
            {
                OrderId = orderId,
                Tip = dto.Tip,
                Amount = dto.TotalAmount / dto.PaymentSplit,
                Currency = dto.Currency,
                OrganizationId = dto.OrganizationId,
            };

            if (dto.IsPaid)
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null) return false;

                order.PaymentStatus = PaymentEnum.succeeded;
                _context.Orders.Update(order);
            }

            _context.Payments.Add(Payment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync(Guid organizationId)
        {
            return await _context.Orders
                .Where(o => o.OrganizationId == organizationId)
                .ToListAsync();
        }

        public async Task<OrderDetailsResponseDto?> GetOrderDetailsAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Where(o => o.Id == orderId)
                .FirstOrDefaultAsync();

            if (order == null) return null;

            var orderItems = await _context.OrderItems
                .Where(o => o.OrderId == orderId)
                .ToListAsync();

            if (orderItems.Count == 0) return null;

            decimal subTotal = 0;
            foreach (var item in orderItems)
            {
                decimal itemPriceWithDiscount = item.Price * (1 - (item.Discount ?? 0) / 100);
                subTotal += (itemPriceWithDiscount + (item.Tax ?? 0)) * item.Quantity;
            }
            
            subTotal = subTotal * (1 - (order.Discount ?? 0) / 100);
            
            var orderDetailsDtos = orderItems.Select(item => new OrderItemDto
            {
                Id = item.Id,
                ItemName = item.Name,
                Quantity = item.Quantity,
                Price = item.Price,
                TaxName = item.TaxName ?? string.Empty,
                Tax = item.Tax ?? 0,
                Discount = item.Discount ?? 0,
                MenuItemId = item.MenuItemId ?? Guid.Empty,
                VariationId = item.VariationId ?? Guid.Empty,
                ParentOrderItemId = item.ParentOrderItemId ?? Guid.Empty
            }).ToList();

            return new OrderDetailsResponseDto
            {
                OrderId = orderId,
                OrganizationId = order.OrganizationId,
                Timestamp = order.Timestamp,
                Items = orderDetailsDtos,
                TotalAmount = Math.Round(subTotal, 2)
            };
        }

        public async Task<bool> RefundPaymentAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Where(o => o.Id == orderId)
                .FirstOrDefaultAsync();
            if (order == null) return false;

            order.PaymentStatus = PaymentEnum.refunded;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
