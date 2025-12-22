using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.ServiceBased
{
    public class AppointmentReceipt
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public required string CustomerName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public PaymentEnum PaymentStatus { get; set; }
        public required string ServiceName { get; set; }
        public required decimal ServicePrice { get; set; }
        public required CurrencyEnum Currency {get; set; }
        public Guid EmployeeId { get; set; }
        public required string EmployeeName { get; set; }
        public required Guid OrganizationId { get; set; }
        public List<decimal>? Giftcards { get; set; } = new List<decimal>();
        //navigation to FK's
        public required ICollection<TaxReceipt> Taxes { get; set; } = new List<TaxReceipt>();
        public required ICollection<DiscountReceipt> Discounts { get; set; } = new List<DiscountReceipt>();

    }
}
