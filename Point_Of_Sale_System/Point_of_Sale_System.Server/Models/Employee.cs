using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models
{
    public class Emploee
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string PasswordSalt { get; set; }
        public int AccessFlag { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Schedule> Schedules { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<Organization> Organizations { get; set; }
    }
}
