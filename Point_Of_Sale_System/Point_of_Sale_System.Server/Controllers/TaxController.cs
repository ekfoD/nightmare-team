using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Point_of_Sale_System.Server.Controllers
{   
    [Authorize(Roles = "admin,owner")]
    [ApiController]
    [Route("api/[controller]")]
    public class TaxController : ControllerBase
    {
        private readonly PoSDbContext _context;

        public TaxController(PoSDbContext context)
        {
            _context = context;
        }

        // GET: api/Tax/organization/{organizationId}
        [HttpGet("Organization/{organizationId:guid}")]
        public async Task<IActionResult> GetTaxes(Guid organizationId)
        {
            var taxes = await _context.Taxes
                .Where(t => t.OrganizationId == organizationId)
                .ToListAsync();

            return Ok(taxes);
        }

        // GET: api/Tax/{taxId}
        [HttpGet("{taxId:guid}")]
        public async Task<IActionResult> GetTaxById(Guid taxId)
        {
            var tax = await _context.Taxes.FindAsync(taxId);

            if (tax == null)
                return NotFound();

            return Ok(tax);
        }

        // POST: api/Tax/organization/{organizationId}
        [HttpPost("Organization/{organizationId:guid}")]
        public async Task<IActionResult> AddTax(Guid organizationId, [FromBody] TaxDTO dto)
        {
            // Ensure organization exists
            var orgExists = await _context.Organizations.AnyAsync(o => o.Id == organizationId);
            if (!orgExists)
                return BadRequest("Organization does not exist");


            var tax = new Tax
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Amount = dto.Amount,
                NumberType = dto.NumberType,
                Status = dto.Status,
                OrganizationId = organizationId
            };
            tax.Timestamp = DateTime.UtcNow;

            _context.Taxes.Add(tax);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetTaxById),
                new { taxId = tax.Id },
                tax
            );
        }

        // PUT: api/Tax/{taxId}
        [HttpPut("{taxId:guid}")]
        public async Task<IActionResult> UpdateTax(Guid taxId, [FromBody] TaxDTO dto)
        {
            if (taxId != dto.Id)
                return BadRequest("Tax ID mismatch");


            var existing = await _context.Taxes.FindAsync(taxId);
            if (existing == null)
                return NotFound();

            existing.Name = dto.Name;
            existing.Amount = dto.Amount;
            existing.NumberType = dto.NumberType;
            existing.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(existing);
        }

        // DELETE: api/Tax/{taxId}
        [HttpDelete("{taxId:guid}")]
        public async Task<IActionResult> DeleteTax(Guid taxId)
        {
            var tax = await _context.Taxes.FindAsync(taxId);
            if (tax == null)
                return NotFound();

            _context.Taxes.Remove(tax);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
