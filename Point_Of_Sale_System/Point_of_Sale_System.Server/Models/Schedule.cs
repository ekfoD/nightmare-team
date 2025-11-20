using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models
{
    public class Schedule
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateOnly Date {  get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // foreign key to emploee
        [Required]
        public Guid EmploeeId { get; set; }

        [ForeignKey("EmploeeId")]
        public virtual Emploee Emploee { get; set; }
    }
}
