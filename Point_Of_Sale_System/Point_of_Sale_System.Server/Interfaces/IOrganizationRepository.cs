using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IOrganizationRepository
    {
        Organization GetOrganizationById(Guid OrganizationId);
        Organization UpdateOrganization(Organization updated);
    }
}