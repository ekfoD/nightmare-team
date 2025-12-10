using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<Organization?> GetByIdAsync(Guid id);
        IEnumerable<Organization> GetAll();
        Organization? GetById(Guid id);
        Organization Add(Organization organization);
    }
}