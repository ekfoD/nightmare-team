using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models
{
    public class Payment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required decimal Tip { get; set; }
        public required decimal Amount { get; set; }
        public CurrencyEnum Currency { get; set; }
        public PaymentEnum PaymentStatus { get; set; }
        public RefundEnum RefundStatus { get; set; }
        public Guid StripePaymentId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }

        // foreign key to Order
        public Guid? OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }

        // foreign key to Appointment
        public Guid? AppointmentId { get; set; }

        [ForeignKey("AppointmentId")]
        public virtual Appointment? Appointment { get; set; }

        // foreign key to Giftcard
        public Guid? GiftcardId { get; set; }

        [ForeignKey("GiftcardId")]
        public virtual Giftcard? Giftcard { get; set; }
    }
}
