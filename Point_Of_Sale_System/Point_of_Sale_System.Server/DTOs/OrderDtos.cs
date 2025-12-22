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
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string TaxName { get; set; } = string.Empty;
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public Guid MenuItemId { get; set; }   
        public Guid? VariationId { get; set; }
        public Guid? ParentOrderItemId { get; set; }
    }

    public class OrderDetailsResponseDto
    {
        public Guid OrderId { get; set; }
        public Guid OrganizationId { get; set; }
        public DateTime Timestamp { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public decimal TotalAmount { get; set; }
    }

    public class PaymentDto
    {
        public decimal TotalAmount { get; set; }
        public decimal Tip { get; set; }
        public int PaymentSplit { get; set; }
        public CurrencyEnum Currency { get; set; }
        public bool IsPaid { get; set; }
        public Guid? GiftcardId { get; set; }
        public Guid OrganizationId { get; set; }
    }
}
