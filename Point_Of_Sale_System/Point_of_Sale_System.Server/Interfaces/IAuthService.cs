using System.Threading.Tasks;
using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Services
{
    public interface IAuthService
    {
        Task<bool> SuperAdminExistsAsync(string username);
        Task<bool> EmployeeExistsAsync(string username);

        Task<bool> ValidateSuperAdminCredentialsAsync(string username, string password);
        Task<bool> ValidateEmployeeCredentialsAsync(string username, string password);

        Task<Employee> GetEmployeeFromUsernameAsync(string username);
        Task<Organization> GetOrganizationFromEmployeeAsync(Guid userId);
    }
}
