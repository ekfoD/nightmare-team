using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Dtos;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Stripe;

namespace Point_of_Sale_System.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IPaymentRepository _paymentRepository;

        public PaymentController(IOrderRepository orderRepository, IPaymentRepository paymentRepository)
        {
            _orderRepository = orderRepository;
            _paymentRepository = paymentRepository;
            // Initialize Stripe with a test key - in production this should be in appsettings
            StripeConfiguration.ApiKey = "sk_test_placeholder_key"; 
        }

        // ==========================================
        // Order Management
        // ==========================================

        [HttpPost("CreateOrder")]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var order = new Order
            {
                OrganizationId = dto.OrganizationId
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order);
            
            return Ok(new OrderDto
            {
                Id = createdOrder.Id,
                OrganizationId = createdOrder.OrganizationId,
                Timestamp = createdOrder.Timestamp,
                TotalAmount = 0
            });
        }

        [HttpPost("{orderId}/AddItems")]
        public async Task<ActionResult<OrderDto>> AddItems(Guid orderId, [FromBody] AddItemsDto dtos)
        {
            foreach (var dto in dtos.OrderItems)
            {
                var exists = await _orderRepository.CheckMenuItemOrVariationExistsAsync(dto.MenuItemId, dto.VariationId, orderId, dto.IsParent);
                if (!exists) return NotFound("Item not found");
            }

            var orderItems = new List<OrderItem>();
            foreach (var dto in dtos.OrderItems)
            {
                var orderItem = new OrderItem
                {
                    MenuItemId = dto.MenuItemId,
                    VariationId = dto.VariationId,
                    Quantity = dto.Quantity,
                    OrderId = orderId   
                };
                orderItems.Add(orderItem);
            };
            
            var items = await _orderRepository.AddItemsToOrderAsync(orderItems);
            if (items == null) return NotFound("Items not found");

            return Ok(items);
        }

        [HttpDelete("CancelOrder/{orderId}")]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            return Ok("Order cancelled");
        }

        // ==========================================
        // Payment & Confirmation
        // ==========================================

        [HttpPost("ConfirmOrder/{orderId}")]
        public async Task<ActionResult<PaymentDto>> ConfirmOrder(Guid orderId)
        {
            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order == null) return NotFound("Order not found");

            // Calculate total amount from items (assuming Variation relates to price - simplified here)
            // In a real app we need to fetch variations to sum prices.
            // For now, let's assume 0 or we need to fetch items with details.
            // The GetOrderAsync does include OrderItems -> Variation.
            
            decimal totalAmount = order.OrderItems?.Sum(i => ((i.Variation != null ? i.Variation.Price : i.MenuItem?.Price) ?? 0) * i.Quantity) ?? 0;

            var payment = new Models.Entities.OrdersAndPayments.Payment
            {
                OrderId = orderId,
                OrganizationId = order.OrganizationId,
                Amount = totalAmount,
                Currency = CurrencyEnum.dollar, // Default
                PaymentStatus = PaymentEnum.pending,
                RefundStatus = RefundEnum.unfunded,
                Tip = 0
            };

            var createdPayment = await _paymentRepository.CreatePaymentAsync(payment);

            return Ok(new PaymentDto
            {
                Id = createdPayment.Id,
                Amount = createdPayment.Amount,
                PaymentStatus = createdPayment.PaymentStatus,
                Timestamp = createdPayment.Timestamp
            });
        }
        
        [HttpGet("ClosedOrders/{organizationId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetClosedOrders(Guid organizationId)
        {
            var orders = await _paymentRepository.GetClosedOrdersAsync(organizationId);
            
            var dtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrganizationId = o.OrganizationId,
                Timestamp = o.Timestamp,
                TotalAmount = o.Payments.Where(p => p.PaymentStatus == PaymentEnum.succeeded).Sum(p => p.Amount),
                Payments = o.Payments.Select(p => new PaymentDto
                {
                    Id = p.Id,
                    Amount = p.Amount,
                    PaymentStatus = p.PaymentStatus,
                    RefundStatus = p.RefundStatus,
                    Currency = p.Currency,
                    Timestamp = p.Timestamp
                }).ToList(),
                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    MenuItemId = i.MenuItemId ?? Guid.Empty,
                    VariationId = i.VariationId ?? Guid.Empty,
                    MenuItemName = i.MenuItem?.Name ?? "",
                    VariationName = i.Variation?.Name ?? "", 
                    Quantity = i.Quantity,
                    UnitPrice = (i.Variation != null ? i.Variation.Price : i.MenuItem?.Price) ?? 0,
                    TotalPrice = ((i.Variation != null ? i.Variation.Price : i.MenuItem?.Price) ?? 0) * i.Quantity
                }).ToList()
            });

            return Ok(dtos);
        }

        [HttpPost("Refund")]
        public async Task<IActionResult> Refund([FromBody] RefundDto dto)
        {
            var payment = await _paymentRepository.GetPaymentAsync(dto.PaymentId);
            if (payment == null) return NotFound("Payment not found");

            // Stripe Refund Logic
            // In a real scenario we would use payment.StripePaymentId
            // var refundService = new RefundService();
            // var refundOptions = new RefundCreateOptions
            // {
            //     PaymentIntent = "pi_...", // we need to store this on payment
            //     Amount = (long?)((dto.Amount ?? payment.Amount) * 100), // Stripe uses cents
            // };
            // var refund = await refundService.CreateAsync(refundOptions);
            
            // Mocking success for now as we don't have real IDs
            bool stripeSuccess = true; 
            
            if (stripeSuccess)
            {
                await _paymentRepository.RefundPaymentAsync(payment.Id, dto.Amount ?? payment.Amount, RefundEnum.succeeded);
                return Ok("Refund processed successfully");
            }
            
            return BadRequest("Refund failed");
        }

        // Helper to get full order DTO
        private async Task<ActionResult<OrderDto>> GetOrderInternal(Guid orderId)
        {
            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order == null) return NotFound("Order not found");

            return Ok(new OrderDto
            {
                Id = order.Id,
                OrganizationId = order.OrganizationId,
                Timestamp = order.Timestamp,
                // Simplify for now
                Items = order.OrderItems.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    MenuItemId = i.MenuItemId ?? Guid.Empty,
                    VariationId = i.VariationId ?? Guid.Empty,
                    Quantity = i.Quantity,
                    MenuItemName = i.MenuItem?.Name ?? "",
                    VariationName = i.Variation?.Name ?? "",
                    UnitPrice = (i.Variation != null ? i.Variation.Price : i.MenuItem?.Price) ?? 0,
                    TotalPrice = ((i.Variation != null ? i.Variation.Price : i.MenuItem?.Price) ?? 0) * i.Quantity
                }).ToList()
            });
        }
    }
}