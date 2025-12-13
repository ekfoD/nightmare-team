using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly PoSDbContext _db;

        public EmployeesController(PoSDbContext db)
        {
            _db = db;
        }

        [HttpGet("{organizationId}")]
        public async Task<IActionResult> Get(Guid organizationId)
        {
            var employees = await _db.Employees
                .Where(e => e.Organizations.Any(o => o.Id == organizationId))
                .Select(e => new EmployeeRequest
                {
                    Id = e.Id,
                    Username = e.Username,
                    AccessFlag = e.AccessFlag,
                    Status = e.Status.ToString()
                })
                .ToListAsync();

            return Ok(employees);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var org = await _db.Organizations.FindAsync(request.OrganizationId);
            if (org == null)
                return BadRequest("Invalid organization");

            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password + salt);

            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = hashedPassword,
                PasswordSalt = salt,
                AccessFlag = request.AccessFlag,
                Status = Enum.TryParse<StatusEnum>(request.Status, true, out var statusEnum)
                    ? statusEnum
                    : StatusEnum.inactive,
                Timestamp = DateTime.UtcNow,
                Organizations = new List<Organization> { org }
            };

            _db.Employees.Add(employee);
            await _db.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpPut("{employeeId}/edit")]
        public async Task<IActionResult> EditEmployee(Guid employeeId, [FromBody] EmployeeRequest request)
        {
            var employee = await _db.Employees
                .Include(e => e.Organizations)
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            employee.Username = request.Username;
            employee.AccessFlag = request.AccessFlag;
            employee.Status = Enum.TryParse<StatusEnum>(request.Status, true, out var statusEnum)
                ? statusEnum
                : StatusEnum.inactive;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var salt = BCrypt.Net.BCrypt.GenerateSalt();
                employee.PasswordSalt = salt;
                employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password + salt);
            }

            await _db.SaveChangesAsync();
            return Ok(employee);
        }

        [HttpDelete("{employeeId}/delete")]
        public async Task<IActionResult> DeleteEmployee(Guid employeeId)
        {
            var employee = await _db.Employees.FindAsync(employeeId);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            _db.Employees.Remove(employee);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully" });
        }
    }
}
