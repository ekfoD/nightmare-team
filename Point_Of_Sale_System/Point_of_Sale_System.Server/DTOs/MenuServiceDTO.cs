using System.Runtime.Versioning;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class MenuServiceDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required int Duration { get; set; } // HH:MM format
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public StatusEnum Status { get; set; }
        public CurrencyEnum Currency { get; set; }
        public List<TaxDTO> Taxes { get; set; } = new();
    }
}
