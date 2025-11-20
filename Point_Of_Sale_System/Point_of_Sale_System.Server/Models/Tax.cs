using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.Models
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

        //navigation to FK's
        public virtual ICollection<MenuItem> MenuItems { get; set; }
        public virtual ICollection<MenuService> MenuServices { get; set; }
    }
}
