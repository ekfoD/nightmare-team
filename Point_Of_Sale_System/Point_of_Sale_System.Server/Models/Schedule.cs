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

        //public TimeOnly EndTime { get; set; } Discuss if this is needed
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public required string Service { get; set; }
        public string? ExtraInfo { get; set; }

        // foreign key to employee
        [Required]
        public Guid EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public virtual required Employee Employee { get; set; }
    }
}
