using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;


namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IOrganizationRepository _orgRepo;

        public EmployeesController(IEmployeeRepository employeeRepository, IOrganizationRepository orgRepo)
        {
            _employeeRepository = employeeRepository;
            _orgRepo = orgRepo;
        }

        // [HttpGet("{organizationId}")]
        // public ActionResult<IEnumerable<Employee>> Get(Guid organizationId)
        // {
        //     var employees = _employeeRepository.GetEmployees(organizationId);
            
        //     return Ok(employees);
        // }

        [HttpGet("{organizationId}")]
        public ActionResult<IEnumerable<EmployeeRequest>> Get(Guid organizationId)
        {
            var employees = _employeeRepository.GetEmployees(organizationId)
                .Select(e => new EmployeeRequest
                {
                    Id = e.Id,
                    Username = e.Username,
                    AccessFlag = e.AccessFlag,
                    Status = e.Status.ToString(),
                    OrganizationId = e.OrganizationId
                });

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
                Timestamp = DateTime.UtcNow,
                OrganizationId = request.OrganizationId
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
