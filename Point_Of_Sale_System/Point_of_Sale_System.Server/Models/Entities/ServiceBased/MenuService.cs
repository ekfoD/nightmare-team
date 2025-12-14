using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.ServiceBased
{
    public class MenuService
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public int Duration { get; set; }
        public required decimal Price { get; set; }
        public required string Description { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public required virtual Organization Organization { get; set; }

        // foreign key to Tax
        [Required]
        public Guid TaxId { get; set; }

        [ForeignKey("TaxId")]
        public virtual Tax Tax { get; set; } = null!;

        // foreign key to Discount
        public Guid? DiscountId { get; set; }

        [ForeignKey("DiscountId")]
        public virtual Discount? Discount { get; set; } = null!;
    }
}
