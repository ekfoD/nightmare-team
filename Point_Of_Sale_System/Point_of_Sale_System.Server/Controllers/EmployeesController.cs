using Azure.Core;
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
    public async Task<ActionResult<IEnumerable<EmployeeGetResponseDTO>>> GetAsync(Guid organizationId)
    {
        var employees = await _context.Employees
            .Where(e => e.Organizations.Any(o => o.Id == organizationId))
            .Select(e => new EmployeeGetResponseDTO
            {
                employeeId = e.Id.ToString(),
                username = e.Username,
                accessFlag = e.AccessFlag,
                status = e.Status.ToString(),
                timestamp = e.Timestamp.ToString("O") 
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddEmployeeAsync([FromBody] EmployeePostRequestDTO request)
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
            Status = Enum.TryParse<StatusEnum>(request.Status.ToLower(), out var status) ? status : StatusEnum.inactive,
            Organizations = new List<Organization>()
        };

        // Ar reikia pas employee manually prideti ta organization?
        employee.Organizations.Add(organization);


        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            employee.Id,
            employee.Username,
            employee.AccessFlag,
            employee.Status
        });

    }

    [HttpPut("{employeeId}/edit")]
    public async Task<IActionResult> PutEmployeeAsync(Guid employeeId, [FromBody] EmployeePutRequestDTO request)
    {
        if (request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == request.OrganizationId);

        if (organization == null)
            return BadRequest("Invalid OrganizationId.");


        var employee = await _context.Employees.FindAsync(employeeId);
        if (employee == null)
            return NotFound("No Employee Found");

        if (request.Username != null)
            employee.Username = request.Username;

        if (request.Status != null)
            employee.Status = Enum.TryParse<StatusEnum>(request.Status.ToLower(), out var status) ? status : StatusEnum.inactive;

        if (request.AccessFlag != 0)
            employee.AccessFlag = request.AccessFlag;

        if (request.Password != null)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, salt);

            employee.PasswordSalt = salt;
            employee.PasswordHash = passwordHash;
        }

        _context.Employees.Update(employee);
        await _context.SaveChangesAsync();

        return Ok(new EmployeeGetResponseDTO
        {
            employeeId = employee.Id.ToString(),
            username = employee.Username,
            accessFlag = employee.AccessFlag,
            status = employee.Status.ToString(),
            timestamp = employee.Timestamp.ToString("O")
        });
    }

    [HttpDelete("{employeeId}/delete")]
    public async Task<IActionResult> DeleteEmployeeAsync(Guid employeeId)
    {
        var employee = await _context.Employees
            .Include(e => e.Organizations) 
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
            return NotFound("Employee not found");

        employee.Organizations.Clear();

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();

        return Ok("Successfully deleted employee");
    }


}
