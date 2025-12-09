using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Models.Entities.Buisness;


namespace Point_of_Sale_System.Server.Controllers
{




    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeesController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        [HttpGet("{organizationId}")]
        public ActionResult<IEnumerable<Employee>> Get(Guid organizationId)
        {
            var employees = _employeeRepository.GetEmployees(organizationId);
            return Ok(employees);
        }

        [HttpPost("add")]
        public IActionResult AddEmployee([FromBody] EmployeeRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password + salt);

            var newEmployee = new Employee
            {
                Username = request.Username,
                PasswordHash = hashedPassword,
                PasswordSalt = salt,
                AccessFlag = request.AccessFlag,
                Status = Enum.TryParse<StatusEnum>(request.Status, true, out var statusEnum)
                    ? statusEnum
                    : StatusEnum.inactive,
                Timestamp = DateTime.UtcNow
            };
            

            _employeeRepository.AddEmployee(newEmployee);

            return Ok(newEmployee);
        }



        [HttpPut("{employeeId}/edit")]
        public IActionResult EditEmployee(Guid employeeId, [FromBody] EmployeeRequest request)
        {
            var existing = _employeeRepository.GetById(employeeId);
            if (existing == null)
                return NotFound(new { message = "Employee not found" });

            existing.Username = request.Username;
            existing.AccessFlag = request.AccessFlag;
            existing.Status = Enum.TryParse<StatusEnum>(request.Status, true, out var statusEnum)
                    ? statusEnum
                    : StatusEnum.inactive;

            // Update password only if supplied
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var newSalt = BCrypt.Net.BCrypt.GenerateSalt();
                existing.PasswordSalt = newSalt;
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password + newSalt);
            }

            _employeeRepository.UpdateEmployee(existing);

            return Ok(existing);
        }

        [HttpDelete("{employeeId}/delete")]
        public IActionResult DeleteEmployee(Guid employeeId)
        {
            var deleted = _employeeRepository.DeleteEmployee(employeeId);

            if (!deleted)
                return NotFound(new { message = "Employee not found" });

            return Ok(new { message = "Employee deleted successfully" });
        }
    }
}
