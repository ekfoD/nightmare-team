using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Controllers;




[ApiController]
[Route("api/[controller]s")]
public class OrganizationController : ControllerBase
{
    private readonly PoSDbContext  _context;

    public OrganizationController(PoSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<OrganizationGetDTO>>> GetOrganizationsPaginatedAsync(
        int pageNumber = 1,
        int pageSize = 10)
    {
        var totalItems = await _context.Organizations.CountAsync();

        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var organizations = await _context.Organizations
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrganizationGetDTO
            {
                OrganizationId = o.Id,
                Name = o.Name,
                OrganizationType = (int) o.Plan,
                Address = o.Address,
                EmailAddress = o.EmailAddress,
                PhoneNumber = o.PhoneNumber
            })
            .ToListAsync();

        var response = new PagedResponseDto<OrganizationGetDTO>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = pageNumber,
            Items = organizations
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<OrganizationGetDTO>> AddOrganizationAsync([FromBody] OrganizationPostDTO request)
    {
        if (request == null)
            return BadRequest("Request body is null.");

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");


        var organization = new Organization
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Plan = (PlanEnum) request.OrganizationType,
            Address = request.Address,
            EmailAddress = request.EmailAddress,
            PhoneNumber = request.PhoneNumber,
            Status = Enums.StatusEnum.inactive,
            Currency = (CurrencyEnum) request.CurrencyType
        };

        _context.Organizations.Add(organization);
        await _context.SaveChangesAsync();

        var response = new OrganizationGetDTO
        {
            OrganizationId = organization.Id,
            Name = organization.Name,
            OrganizationType = (int) organization.Plan,
            Address = organization.Address,
            EmailAddress = organization.EmailAddress,
            PhoneNumber = organization.PhoneNumber
        };

        return Created("Successfully created an organization", response);
    }

    [HttpGet("{organizationId}")]
    public async Task<ActionResult<OrganizationGetDTO>> GetOrganizationByIdAsync(Guid organizationId)
    {
        var organization = await _context.Organizations.FindAsync(organizationId);

        var response = new OrganizationGetDTO
        {
            OrganizationId = organization.Id,
            Name = organization.Name,
            Address = organization.Address,
            EmailAddress = organization.EmailAddress,
            PhoneNumber = organization.PhoneNumber
        };

        return Ok(response);
    }

    [HttpPut("{organizationId}")]
    public async Task<ActionResult<OrganizationGetDTO>> PutOrganizationAsync(
    Guid organizationId,
    [FromBody] OrganizationPostDTO request)
    {
        if (request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations.FindAsync(organizationId);
        if (organization == null)
            return NotFound($"Organization with ID {organizationId} not found.");

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");

        organization.Name = request.Name;
        organization.Plan = (PlanEnum)request.OrganizationType;
        organization.Address = request.Address;
        organization.EmailAddress = request.EmailAddress;
        organization.PhoneNumber = request.PhoneNumber;
        organization.Currency = (CurrencyEnum)request.CurrencyType;

        _context.Organizations.Update(organization);
        await _context.SaveChangesAsync();

        var response = new OrganizationGetDTO
        {
            OrganizationId = organization.Id,
            Name = organization.Name,
            OrganizationType = (int)organization.Plan,
            Address = organization.Address,
            EmailAddress = organization.EmailAddress,
            PhoneNumber = organization.PhoneNumber
        };

        return Ok(response);
    }

    [HttpDelete("{organizationId}")]
    public async Task<IActionResult> DeleteOrganizationAsync(Guid organizationId)
    {
        if (Request == null)
            return BadRequest("Request body is null.");

        var organization = await _context.Organizations.FindAsync(organizationId);
        if (organization == null)
            return NotFound($"Organization with ID {organizationId} not found.");

        _context.Organizations.Remove(organization);
        await _context.SaveChangesAsync();

        return Ok("Successful deletion");
    }
}
