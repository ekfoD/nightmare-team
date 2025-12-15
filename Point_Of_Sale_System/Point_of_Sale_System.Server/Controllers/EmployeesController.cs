using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;
using System.Security.Claims;
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

    [Authorize(Roles = "admin,owner,manager,employee")]
    [HttpGet("{organizationId}")]
    public async Task<ActionResult<IEnumerable<EmployeeGetResponseDTO>>> GetAsync(Guid organizationId)
    {
        var role = User.FindFirst("role")?.Value;

        var query = _context.Employees
            .Where(e => e.Organizations.Any(o => o.Id == organizationId));

        if (User.IsInRole("employee"))
            query = query.Where(e => e.AccessFlag != 2 && e.AccessFlag != 3);

        if (User.IsInRole("manager"))
            query = query.Where(e => e.AccessFlag != 2 && e.AccessFlag != 3);

        if (User.IsInRole("owner"))
            query = query.Where(e => e.AccessFlag != 2);
        // Sorry for magic numbers and stupid ass double if, 2 is owner by our enum and 3 is manager, 4 is employee
        // Basically Owner doesn't see other owners and manager doesn't see managers and owners.

        var employees = await query
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


    [Authorize(Roles = "admin,owner,manager")]
    [HttpPost("add")]
    public async Task<IActionResult> AddEmployeeAsync([FromBody] EmployeePostRequestDTO request)
    {
        var businessId = User.FindFirst("businessId")?.Value;
        var fixedString = User.FindFirst(ClaimTypes.Role).Value.ToString();
        if (!string.IsNullOrEmpty(fixedString))
        {
            fixedString = char.ToUpper(fixedString[0]) + fixedString.Substring(1);
        }
        var accessFlag = (int) Enum.Parse(typeof(RoleEnum), fixedString); // Holy damn this is garbage, that's the easiest way to convert our JWT to an int
        
        if (businessId != request.OrganizationId.ToString())
            return Forbid("OrganizationId not matching.");

        if (request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == request.OrganizationId);

        if (organization == null)
            return BadRequest("Invalid OrganizationId.");

        if (accessFlag >= request.AccessFlag)
            Forbid("Unauthorized request");

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

    [Authorize(Roles = "admin,owner,manager")]
    [HttpPut("{employeeId}/edit")]
    public async Task<IActionResult> PutEmployeeAsync(Guid employeeId, [FromBody] EmployeePutRequestDTO request)
    {
        var fixedString = User.FindFirst("role")?.Value.ToString();
        if (!string.IsNullOrEmpty(fixedString))
        {
            fixedString = char.ToUpper(fixedString[0]) + fixedString.Substring(1);
        }
        var accessFlag = (int)Enum.Parse(typeof(RoleEnum), fixedString);

        var businessId = User.FindFirst("businessId")?.Value;
        if (businessId != request.OrganizationId.ToString())
            return Forbid("OrganizationId not matching.");

        if (request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == request.OrganizationId);

        if (organization == null)
            return BadRequest("Invalid OrganizationId.");


        var employee = await _context.Employees.FindAsync(employeeId);
        if (employee == null)
            return NotFound("No Employee Found");

        if (accessFlag >= employee.AccessFlag)
            Forbid("Unauthorized request.");

        if (accessFlag >= request.AccessFlag)
            Forbid("Unauthorized request.");

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

    [Authorize(Roles = "admin,owner,manager")]
    [HttpDelete("{employeeId}/delete")]
    public async Task<IActionResult> DeleteEmployeeAsync(Guid employeeId)
    {
        var businessId = User.FindFirst("businessId")?.Value;
        var fixedString = User.FindFirst("role")?.Value.ToString();
        if (!string.IsNullOrEmpty(fixedString))
        {
            fixedString = char.ToUpper(fixedString[0]) + fixedString.Substring(1);
        }
        var accessFlag = (int)Enum.Parse(typeof(RoleEnum), fixedString);

        var employee = await _context.Employees
            .Include(e => e.Organizations) 
            .FirstOrDefaultAsync(e => e.Id == employeeId);


        if (employee == null)
            return NotFound("Employee not found");

        if (accessFlag >= employee.AccessFlag)
            Forbid("Unauthorized request.");

        var belongingOrganization = employee.Organizations.FirstOrDefault();

        if (belongingOrganization == null)
            return BadRequest("This user does not belong to any organization.");

        if (belongingOrganization.Id.ToString() != businessId)
            return Forbid("OrganizationId not matching.");
            

        employee.Organizations.Clear();

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();

        return Ok("Successfully deleted employee");
    }


}
