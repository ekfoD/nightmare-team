using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments
{
    public class Giftcard
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required decimal Balance { get; set; }
        public DateOnly ValidUntil { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }

        //navigation to FK's
        public virtual ICollection<Payment> Payments { get; set; }


    }
}
