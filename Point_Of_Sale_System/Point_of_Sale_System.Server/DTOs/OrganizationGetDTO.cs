using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class OrganizationGetDTO
    {
        public Guid OrganizationId { get; set; }
        public required string Name { get; set; }
        public int OrganizationType { get; set; }
        public required string Address { get; set; }
        public required string EmailAddress { get; set; }
        public required string PhoneNumber { get; set; }
    }
}
