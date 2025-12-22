using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.MenuBased
{
    public class MenuItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required decimal Price { get; set; }
        public string? ImagePath { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Variation?> Variations { get; set; } = new List<Variation>();

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization? Organization { get; set; }

        // foreign key to Tax
        [Required]
        public Guid TaxId { get; set; }

        [ForeignKey("TaxId")]
        public virtual Tax? Tax { get; set; }

        // foreign key to Discount
        public Guid? DiscountId { get; set; }

        [ForeignKey("DiscountId")]
        public virtual Discount? Discount { get; set; }
    }
}
