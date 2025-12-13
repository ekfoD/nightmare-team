using Microsoft.Identity.Client;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class OrganizationPostDTO
    {
        public required string Name { get; set; }
        public required int OrganizationType { get; set; }
        public required string Address { get; set; }
        public required string EmailAddress { get; set; }
        public required string PhoneNumber { get; set; }
        public required int CurrencyType {  get; set; }
    }
}
