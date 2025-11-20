using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models
{
    public class Appointment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string CustomerName { get; set; }
        public required string CustomerPhone { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Payment> Payments { get; set; }

        // foreign key to emploee
        [Required]
        public Guid EmploeeId { get; set; }

        [ForeignKey("EmploeeId")]
        public virtual Emploee Emploee { get; set; }

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }

        // foreign key to MenuService
        [Required]
        public Guid MenuServiceId { get; set; }

        [ForeignKey("MenuServiceId")]
        public virtual MenuService MenuService { get; set; }
    }
}
