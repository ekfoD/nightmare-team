using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.Threading.Tasks;


namespace Point_of_Sale_System.Server.Controllers;




[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly PoSDbContext _context;

    public EmployeesController(PoSDbContext context)
    {
        _context = context;
    }

    [HttpGet("{organizationId}")]
    public async Task<ActionResult<IEnumerable<Employee>>> GetAsync(Guid organizationId)
    {
        var employees = await _context.Employees
            .Where(e => e.Organizations.Any(o => o.Id == organizationId))
            .ToListAsync();

        return Ok(employees);
    }


    [HttpPost("add")]
    public async Task<IActionResult> AddEmployeeAsync([FromBody] EmployeeRequest request)
    {
        if (request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == request.OrganizationId);

        if (organization == null)
            return BadRequest("Invalid OrganizationId.");

        string salt = BCrypt.Net.BCrypt.GenerateSalt();
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, salt);

        var employee = new Employee
        {
            Username = request.Username,
            PasswordHash = passwordHash,
            PasswordSalt = salt,
            AccessFlag = request.AccessFlag,
            Status = Enum.TryParse<StatusEnum>(request.Status, out var status) ? status : StatusEnum.inactive
        };

        // Ar reikia pas employee manually prideti ta organization?

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            employee.Id,
            employee.Username,
            employee.AccessFlag,
            employee.Status,
            Organizations = employee.Organizations.Select(o => new { o.Id, o.Name })
        });

    }
}
