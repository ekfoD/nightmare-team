using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models
{
    public class SuperAdmin
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string PasswordSalt { get; set; }
    }
}
