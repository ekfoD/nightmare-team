using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class CreateOrderDto
    {
        public Guid OrganizationId { get; set; }
    }

    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public DateTime Timestamp { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public List<PaymentDto> Payments { get; set; } = new List<PaymentDto>();
        public decimal TotalAmount { get; set; }
    }

    public class AddItemsDto
    {
        public Guid OrderId { get; set; }
        public List<AddItemDto> OrderItems { get; set; } = new List<AddItemDto>();
    }

    public class AddItemDto
    {
        public Guid MenuItemId { get; set; }
        public Guid? VariationId { get; set; }
        public int Quantity { get; set; }
        public bool IsParent { get; set; }
    }

    public class AddItemsResponseDto
    {
        public Guid OrderId { get; set; }
        public DateTime Timestamp { get; set; }
        public List<AddItemDto> OrderItems { get; set; } = new List<AddItemDto>();
    }

    public class OrderItemDto
    {
        public Guid Id { get; set; }
        public Guid MenuItemId { get; set; }   
        public Guid? VariationId { get; set; }
        public string MenuItemName { get; set; } = string.Empty;
        public string VariationName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class PaymentDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public decimal Tip { get; set; }
        public CurrencyEnum Currency { get; set; }
        public PaymentEnum PaymentStatus { get; set; }
        public RefundEnum RefundStatus { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid? OrderId { get; set; }
    }

    public class RefundDto
    {
        public Guid PaymentId { get; set; }
        public decimal? Amount { get; set; } // Optional for partial refund
    }
}
