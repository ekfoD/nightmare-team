using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models.Entities.Business
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
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<Payment> Payments { get; set; }  = new List<Payment>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
        public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
        public virtual ICollection<MenuService> MenuServices { get; set; } = new List<MenuService>();
    }
}
