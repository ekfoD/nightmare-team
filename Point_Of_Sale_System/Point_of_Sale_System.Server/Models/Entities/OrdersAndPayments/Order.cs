using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public PaymentEnum PaymentStatus { get; set; } = PaymentEnum.created;
        public decimal? Discount { get; set; }

        //navigation to FK's
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }
    }
}
