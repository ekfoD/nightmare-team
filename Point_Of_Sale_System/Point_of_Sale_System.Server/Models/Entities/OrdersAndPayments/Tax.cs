using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using System.ComponentModel.DataAnnotations;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.ComponentModel.DataAnnotations.Schema;

namespace Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments
{
    public class Tax
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required decimal Amount { get; set; }
        public NumberTypeEnum NumberType { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

       [Required]
        public Guid OrganizationId { get; set; }

        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; }

        //navigation to FK's
        public virtual ICollection<MenuItem> MenuItems { get; set; }
        public virtual ICollection<MenuService> MenuServices { get; set; }

    }
}
