using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.Dtos
{
    public class CreateMenuServiceDto
    {
        public required string Name { get; set; }
        public required string Duration { get; set; } // Will parse to TimeOnly
        public required decimal Price { get; set; }
        public required string Description { get; set; }
        public required StatusEnum Status { get; set; }
        public required Guid OrganizationId { get; set; }
        //public required Guid TaxId { get; set; }
        public Guid? DiscountId { get; set; } // optional
    }
}
