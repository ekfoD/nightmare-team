using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.Buisness
{
    public class Schedule
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateOnly Date {  get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // foreign key to employee
        [Required]
        public Guid EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; }
    }
}
