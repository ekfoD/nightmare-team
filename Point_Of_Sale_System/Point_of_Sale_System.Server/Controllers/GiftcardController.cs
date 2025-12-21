using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.DTOs;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/[controller]")]
public class GiftcardController : ControllerBase
{
    private readonly PoSDbContext _context;

        public GiftcardController(PoSDbContext context)
        {
            _context = context;
        }


    // =========================
    // GET ALL BY ORGANIZATION
    // =========================
    [Authorize(Roles = "admin,owner")]
    [HttpGet("organization/{organizationId:guid}")]
    public async Task<ActionResult<IEnumerable<GiftcardDTO>>> GetByOrganization(Guid organizationId)
    {
        var giftcards = await _context.Giftcards
            .Where(g => g.OrganizationId == organizationId)
            .Select(g => new GiftcardDTO
            {
                Id = g.Id,
                Balance = g.Balance,
                ValidUntil = g.ValidUntil,
            })
            .ToListAsync();

        return Ok(giftcards);
    }

    // =========================
    // GET SINGLE
    // =========================
    [Authorize(Roles = "admin,owner,manager,employee")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GiftcardDTO>> Get(Guid id)
    {
        var giftcard = await _context.Giftcards.FindAsync(id);
        if (giftcard == null)
            return NotFound();

        return Ok(new GiftcardDTO
        {
            Id = giftcard.Id,
            Balance = giftcard.Balance,
            ValidUntil = giftcard.ValidUntil,
        });
    }

    // =========================
    // CREATE
    // =========================
    [Authorize(Roles = "admin,owner")]
    [HttpPost("organization/{organizationId:guid}")]
    public async Task<ActionResult<GiftcardDTO>> Create(
        Guid organizationId,
        [FromBody] GiftcardDTO dto)
    {
        var giftcard = new Giftcard
        {
            Id = Guid.NewGuid(),
            Balance = dto.Balance,
            ValidUntil = dto.ValidUntil,
            OrganizationId = organizationId,
            Timestamp = DateTime.UtcNow
        };

        _context.Giftcards.Add(giftcard);
        await _context.SaveChangesAsync();

        dto.Id = giftcard.Id;
        return CreatedAtAction(nameof(Get), new { id = giftcard.Id }, dto);
    }

    // =========================
    // UPDATE
    // =========================
    [Authorize(Roles = "admin,owner")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] GiftcardDTO dto)
    {
        var giftcard = await _context.Giftcards.FindAsync(id);
        if (giftcard == null)
            return NotFound();

        giftcard.Balance = dto.Balance;
        giftcard.ValidUntil = dto.ValidUntil;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // =========================
    // DELETE
    // =========================
    [Authorize(Roles = "admin,owner,manager,employee")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var giftcard = await _context.Giftcards.FindAsync(id);
        if (giftcard == null)
            return NotFound();

        _context.Giftcards.Remove(giftcard);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
