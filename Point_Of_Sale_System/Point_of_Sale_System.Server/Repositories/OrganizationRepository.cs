using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Interfaces;

namespace Point_of_Sale_System.Server.Repositories
{
    public class OrganizationRepository : IOrganizationRepository
    {
        public static readonly List<Organization> _organizations = new();

        public IEnumerable<Organization> GetAll()
        {
            return _organizations;
        }

        public Organization? GetById(Guid id)
        {
            return _organizations.FirstOrDefault(o => o.Id == id);
        }

        public Task<Organization?> GetByIdAsync(Guid id)
        {
            return Task.FromResult(_organizations.FirstOrDefault(o => o.Id == id));
        }

        public Organization AddOrganization(Organization org)
        {
            _organizations.Add(org);
            return org;
        }

        public Organization? UpdateOrganization(Organization updated)
        {
            var existing = GetById(updated.Id);
            if (existing == null) return null;

            existing.Name = updated.Name;
            existing.Address = updated.Address;
            existing.EmailAddress = updated.EmailAddress;
            existing.PhoneNumber = updated.PhoneNumber;
            existing.Plan = updated.Plan;
            existing.Currency = updated.Currency;
            existing.Status = updated.Status;

            return existing;
        }

        public bool DeleteOrganization(Guid id)
        {
            var existing = GetById(id);
            if (existing == null) return false;

            _organizations.Remove(existing);
            return true;
        }

            public Organization Add(Organization organization)
        {
            _organizations.Add(organization);
            return organization;
        }
    }
}
