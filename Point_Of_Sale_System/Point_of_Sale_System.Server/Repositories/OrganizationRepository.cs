using Point_of_Sale_System.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.Business;


namespace Point_of_Sale_System.Server.Repositories
{
    public class OrganizationRepository : IOrganizationRepository
    {

        private readonly PoSDbContext _context;

        public OrganizationRepository(PoSDbContext context)
        {
            _context = context;
        }

        public async Task<Organization> GetOrganizationAsync(Guid organizationId)
        {
            var organization = await _context.Organizations.FindAsync(organizationId);
            if (organization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {organizationId} not found.");
            }

            return organization;
        }


    }
}
