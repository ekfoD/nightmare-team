using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Controllers
{
    public class EmployeeRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int AccessFlag { get; set; }
        public string Status { get; set; }
    }



    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        
        private static List<Employee> employeeList = new List<Employee>
        {
            new Employee{
                Id = Guid.NewGuid(),
                Username = "jdoe",
                PasswordHash = "HASH123",
                PasswordSalt = "SALT123",
                AccessFlag = 1,
                Status = StatusEnum.active,
                Timestamp = DateTime.Now,
                Schedules = new List<Schedule>(),
                Appointments = new List<Appointment>(),
                Organizations = new List<Organization>()
            },
            new Employee{
                Id = Guid.NewGuid(),
                Username = "asmith",
                PasswordHash = "HASH456",
                PasswordSalt = "SALT456",
                AccessFlag = 2,
                Status = StatusEnum.inactive,
                Timestamp = DateTime.Now,
                Schedules = new List<Schedule>(),
                Appointments = new List<Appointment>(),
                Organizations = new List<Organization>()
            },
            new Employee{
                Id = Guid.NewGuid(),
                Username = "mjohnson",
                PasswordHash = "HASH789",
                PasswordSalt = "SALT789",
                AccessFlag = 3,
                Status = StatusEnum.unavailable,
                Timestamp = DateTime.Now,
                Schedules = new List<Schedule>(),
                Appointments = new List<Appointment>(),
                Organizations = new List<Organization>()
            }
        };

        [HttpGet("{organizationId}")]
        public IEnumerable<Employee> Get(Guid organizationId){
            return employeeList;
        }

        [HttpPost("add")]
        public IActionResult AddEmployee([FromBody] EmployeeRequest request)
        {
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = "LikeReallyMadeUp",
                PasswordSalt = "MadeUp",
                AccessFlag = request.AccessFlag,
                Status = Enum.Parse<StatusEnum>(request.Status.ToLower()),
                Timestamp = DateTime.Now
            };

            employeeList.Add(employee);
            Console.WriteLine(employee);
            return Ok(employee);
        }


        public class EmployeeLol
        {
            public Guid Id { get; set; } = Guid.NewGuid();
            public required string Username { get; set; }
            public required string Password { get; set; }
            public int AccessFlag { get; set; }
            public StatusEnum Status { get; set; }
        }

        [HttpPut("{employeeId}/edit")]
        public IActionResult EditEmployee(Guid employeeId, [FromBody] EmployeeRequest request)
        {
            var employee = employeeList.FirstOrDefault(e => e.Id == employeeId);
            if (employee == null)
            {
                return NotFound(new { message = "Employee not found." });
            }

            employee.Username = request.Username ?? employee.Username;
            employee.PasswordHash = "Genuinelymadeup";
            employee.AccessFlag = request.AccessFlag;
            employee.Status = Enum.Parse<StatusEnum>(request.Status.ToLower());
            employee.Timestamp = DateTime.Now;

            return Ok(new { message = "Employee updated successfully." });
        }

        [HttpDelete("{employeeId}/delete")]
        public IActionResult DeleteEmployee (Guid employeeId)
        {
            var employee = employeeList.FirstOrDefault(e => e.Id == employeeId);

            if (employee == null)
            {
                return NotFound(new { message = "Employee not found." });
            }

            employeeList.Remove(employee);

            return Ok(new { message = "Employee deleted successfully." });
        }
    }
}
