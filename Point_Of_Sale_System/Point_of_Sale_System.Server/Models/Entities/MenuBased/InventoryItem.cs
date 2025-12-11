using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.MenuBased
{
    public class InventoryItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required int Quantity { get; set; }
        public required StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }
    }
}
