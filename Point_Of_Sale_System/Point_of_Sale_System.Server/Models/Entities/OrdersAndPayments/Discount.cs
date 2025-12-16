using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments
{
    public class Discount
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required decimal Amount { get; set; }
        public AppliedToEnum ApplicableTo { get; set; }
        public DateOnly ValidFrom { get; set; }
        public DateOnly ValidUntil { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        
        //navigation to FK's
        public required Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public required Organization Organization { get; set;}
        public virtual ICollection<Order>? Orders { get; set; }
        public virtual ICollection<MenuItem>? MenuItems { get; set; }
        public virtual ICollection<MenuService>? MenuServices { get; set; }
    }
}
