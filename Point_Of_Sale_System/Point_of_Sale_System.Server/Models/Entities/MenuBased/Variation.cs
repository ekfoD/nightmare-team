using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.MenuBased
{
    public class Variation
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required decimal Price { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<OrderItem?> OrderItems { get; set; } = new List<OrderItem>();

        // foreign key to MenuItem
        [Required]
        public Guid MenuItemId { get; set; }

        [ForeignKey("MenuItemId")]
        public virtual MenuItem? MenuItem { get; set; }
    }
}
