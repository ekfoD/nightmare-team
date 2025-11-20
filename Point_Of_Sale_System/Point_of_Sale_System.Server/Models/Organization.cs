using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models
{
    public class Organization
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string EmailAddress { get; set; }
        public required string PhoneNumber { get; set; }
        public required PlanEnum Plan { get; set; }
        public required CurrencyEnum Currency { get; set; }
        public required StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        //navigation to FK's
        public virtual ICollection<Emploee> Emploees { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<InventoryItem> InventoryItems { get; set; }
        public virtual ICollection<MenuItem> MenuItems { get; set; }
        public virtual ICollection<MenuService> MenuServices { get; set; }
    }
}
