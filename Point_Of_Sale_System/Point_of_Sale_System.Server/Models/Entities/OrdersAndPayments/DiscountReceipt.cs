using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments 
{
    public class DiscountReceipt
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required decimal AffectedAmount { get; set; }
        public Guid ReceiptId { get; set; }

        [ForeignKey("ReceiptId")]
        public AppointmentReceipt Receipt { get; set; } = null!;
        public required decimal Procentage { get; set; }

    }
}