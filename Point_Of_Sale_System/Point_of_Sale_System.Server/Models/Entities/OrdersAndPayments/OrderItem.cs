using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments
{
    public class OrderItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? TaxName { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }

        //navigation to FK's
        public virtual ICollection<OrderItem> ChildOrderItems { get; set; }

        // foreign key to Order
        [Required]
        public Guid OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        // foreign key to Variation
        public Guid? VariationId { get; set; }

        [ForeignKey("VariationId")]
        public virtual Variation? Variation { get; set; }

        // foreign key to MenuItem
        public Guid? MenuItemId { get; set; }

        [ForeignKey("MenuItemId")]
        public virtual MenuItem? MenuItem { get; set; }

        // foreign key to Parent OrderItem
        public Guid? ParentOrderItemId { get; set; }

        [ForeignKey("ParentOrderItemId")]
        public virtual OrderItem? ParentOrderItem { get; set; }
    }
}
