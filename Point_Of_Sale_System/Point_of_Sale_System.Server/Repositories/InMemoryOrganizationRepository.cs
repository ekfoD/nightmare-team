using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Enums;

public class InMemoryOrganizationRepository : IOrganizationrepository
{

    private static readonly List<Organization> _organizations = new()
    {
        new Organization
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Acme Corporation",
            Address = "123 Market Street, Springfield",
            EmailAddress = "info@acme.com",
            PhoneNumber = "+1 555 123 4567",
            Plan = PlanEnum.service,
            Currency = CurrencyEnum.dollar,
            Status = StatusEnum.active,
            Timestamp = DateTime.Now
        },
        new Organization
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "TechNova Solutions",
            Address = "456 Innovation Avenue, Silicon City",
            EmailAddress = "support@technova.com",
            PhoneNumber = "+1 555 987 6543",
            Plan = PlanEnum.order,
            Currency = CurrencyEnum.euro,
            Status = StatusEnum.active,
            Timestamp = DateTime.Now
        },
        new Organization
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "BlueWave Retail",
            Address = "789 Ocean Drive, Miami",
            EmailAddress = "contact@bluewave.com",
            PhoneNumber = "+1 555 222 7788",
            Plan = PlanEnum.order_service,
            Currency = CurrencyEnum.euro,
            Status = StatusEnum.active,
            Timestamp = DateTime.Now
        }
    };

    public Organization GetOrganizationById(Guid OrganizationId)
    {
        return _organizations.FirstOrDefault(e => e.Id == OrganizationId);
    }
}