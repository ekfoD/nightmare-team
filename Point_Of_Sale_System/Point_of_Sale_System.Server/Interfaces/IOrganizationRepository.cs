using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<Organization> GetOrganizationAsync(Guid organizationId);
    }
}