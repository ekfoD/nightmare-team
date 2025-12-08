using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs;

public class OrganizationRequest
{
    public Guid OrganizationId { get; set; }
    public Guid OwnerId { get; set; }
    public string Name { get; set; }
    public string OrganizationType { get; set; }
    public string Address { get; set; }
    public string EmailAddress { get; set; }
    public string PhoneNumber { get; set; }

}