using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Data;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.Security.Cryptography;
using System.Text;

namespace Point_of_Sale_System.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly PoSDbContext _context;

        public AuthService(PoSDbContext context)
        {
            _context = context;
        }

        /* ------------------- EXISTS CHECKS ------------------- */

        public async Task<bool> SuperAdminExistsAsync(string username)
        {
            return await _context.SuperAdmins
                .AnyAsync(x => x.Username == username);
        }

        public async Task<bool> EmployeeExistsAsync(string username)
        {
            return await _context.Employees
                .AnyAsync(x => x.Username == username);
        }

        /* ------------------- PASSWORD VALIDATION ------------------- */

        public async Task<bool> ValidateSuperAdminCredentialsAsync(
            string username,
            string password)
        {
            var admin = await _context.SuperAdmins
                .FirstOrDefaultAsync(x => x.Username == username);

            if (admin == null)
                return false;

            return VerifyPassword(
                password,
                admin.PasswordHash
            );
        }

        public async Task<bool> ValidateEmployeeCredentialsAsync(
            string username,
            string password)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(x => x.Username == username);

            if (employee == null)
                return false;


            return VerifyPassword(
                password,
                employee.PasswordHash
            );
        }

        /* ------------------- PASSWORD HASHING ------------------- */

        private bool VerifyPassword(string password, string storedHash)
        {
            // BCrypt automatically extracts salt & cost from storedHash
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }

        public async Task<Employee> GetEmployeeFromUsernameAsync(string username)
        {
            return await _context.Employees.FirstOrDefaultAsync(x => x.Username == username);
        }
        public async Task<Organization> GetOrganizationFromEmployeeAsync(Guid employeeId)
        {
            var orgs = await _context.Employees
                .Where(e => e.Id == employeeId)
                .SelectMany(e => e.Organizations)
                .ToListAsync();

            if (orgs.Count == 0)
                throw new InvalidOperationException("Employee is not assigned to an organization");

            if (orgs.Count > 1)
                throw new InvalidOperationException("Employee is assigned to multiple organizations");

            return orgs[0];
        }

    }
}
