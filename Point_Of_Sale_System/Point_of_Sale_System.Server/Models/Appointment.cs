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
        public string? ExtraInfo { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

        // foreign key to employee
        [Required]
        public Guid EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public required virtual Employee Employee { get; set; }

        // foreign key to Organization
        [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public required virtual Organization Organization { get; set; }

        // foreign key to MenuService
        [Required]
        public Guid MenuServiceId { get; set; }

        [ForeignKey("MenuServiceId")]
        public required virtual MenuService MenuService { get; set; }
    }
}
