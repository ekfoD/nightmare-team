using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models
{
    public class Giftcard
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required decimal Balance { get; set; }
        public CurrencyEnum Currency { get; set; }
        public DateOnly ValidUntil { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
