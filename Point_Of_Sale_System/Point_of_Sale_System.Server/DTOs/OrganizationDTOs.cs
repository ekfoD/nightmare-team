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

    public class OrganizationPostDTO
    {
        public required string Name { get; set; }
        public required int OrganizationType { get; set; }
        public required string Address { get; set; }
        public required string EmailAddress { get; set; }
        public required string PhoneNumber { get; set; }
        public required int CurrencyType {  get; set; }
    }

    public class OrganizationPutDTO
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public int? CurrencyType { get; set; }
    }

    public class OrganizationRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public CurrencyEnum Currency { get; set; }
        public string Address { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }

    }
}
