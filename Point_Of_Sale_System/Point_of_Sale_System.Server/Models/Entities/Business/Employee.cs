using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models.Entities.Business
{
    public class Employee
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
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<Organization> Organizations { get; set; } = new List<Organization>();
    }
}
