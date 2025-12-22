using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
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
                if (!exists) 
                {
                    if (!(await _orderRepository.OrderFailedAsync(orderId))) return NotFound("Server error, order does not exist");

                    return NotFound("One or more items not found");
                }
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

            if (!(await _orderRepository.AddItemsToOrderAsync(orderItems))) 
            {
                if (!(await _orderRepository.OrderFailedAsync(orderId))) return NotFound("Server error, order does not exist");

                return BadRequest("Items could not be added to order");
            }

            if (!(await _orderRepository.OrderPendingAsync(orderId))) return NotFound("Server error, order is not pending");

            return Ok(new AddItemsResponseDto
            {
                OrderId = orderId,
                Timestamp = DateTime.Now,
                OrderItems = dtos.OrderItems
            });
        }

        [HttpDelete("{orderId}/CancelOrder")]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order == null) return NotFound("Order not found");

            if (!(await _orderRepository.CancelOrderAsync(orderId))) return NotFound("Order not cancelled");

            return Ok("Order cancelled");
        }

        // ==========================================
        // Payment & Confirmation
        // ==========================================
        [HttpGet("{organizationId}/GetAllOrders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders(Guid organizationId)
        {
            var orders = await _paymentRepository.GetAllOrdersAsync(organizationId);
            if (orders == null) return NotFound("No orders found");

            return Ok(orders);
        }

        [HttpGet("{orderId}/GetOrderDetails")]
        public async Task<ActionResult<OrderDetailsResponseDto>> GetOrderDetails(Guid orderId)
        {
            var orderDetailsDto = await _paymentRepository.GetOrderDetailsAsync(orderId);
            if (orderDetailsDto == null) return NotFound("Order details not found");

            return Ok(orderDetailsDto);
        }

        [HttpPost("{orderId}/PayOrder")]
        public async Task<IActionResult> PayOrder(Guid orderId, [FromBody] PaymentDto dto)
        {
            if (!(await _paymentRepository.PayOrderAsync(orderId, dto))) return NotFound("Order not paid");

            return Ok("Order paid");
        }

        [HttpPost("{orderId}/RefundPayment")]
        public async Task<IActionResult> RefundPayment(Guid orderId)
        {
            if (!(await _paymentRepository.RefundPaymentAsync(orderId))) return NotFound("Order not refunded");

            return Ok("Order refunded");
        }
    }
}