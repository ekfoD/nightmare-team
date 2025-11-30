using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        
        private List<Employee> employeeList = new List<Employee>
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
        public async Task<IActionResult> AddEmployee(Employee request)
        {


            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = "LikeReallyMadeUp",   // You should replace this with real hashing
                PasswordSalt = "MadeUp",
                AccessFlag = request.AccessFlag,
                Status = request.Status,
                Timestamp = DateTime.Now,

                Schedules = new List<Schedule>(),
                Appointments = new List<Appointment>(),
                Organizations = new List<Organization>()
            };

            employeeList.Add(employee);

            return Ok(employee);
        }


    }
}
