using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;

public class DiscountService : IDiscountService
{
    private readonly PoSDbContext _db;

    public DiscountService(PoSDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<DiscountResponseDto>> GetAllByOrganizationAsync(Guid organizationId)
    {
        return await _db.Discounts
            .Where(d => d.OrganizationId == organizationId)
            .OrderByDescending(d => d.Timestamp)
            .Select(d => new DiscountResponseDto
            {
                Name = d.Name,
                Id = d.Id,
                Amount = d.Amount,
                ApplicableTo = d.ApplicableTo,
                ValidFrom = d.ValidFrom,
                ValidUntil = d.ValidUntil,
                Status = d.Status,
                Timestamp = d.Timestamp
            })
            .ToListAsync();
    }

    public async Task<DiscountResponseDto?> GetByIdAsync(Guid id)
    {
        return await _db.Discounts
            .Where(d => d.Id == id)
            .Select(d => new DiscountResponseDto
            {   
                Name = d.Name,
                Id = d.Id,
                Amount = d.Amount,
                ApplicableTo = d.ApplicableTo,
                ValidFrom = d.ValidFrom,
                ValidUntil = d.ValidUntil,
                Status = d.Status,
                Timestamp = d.Timestamp
            })
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(CreateDiscountDto dto)
    {
        var org = await _db.Organizations.FindAsync(dto.OrganizationId)
            ?? throw new Exception("Organization not found");

        var discount = new Discount
        {
            Name = dto.Name,
            Amount = dto.Amount,
            ApplicableTo = dto.ApplicableTo,
            ValidFrom = dto.ValidFrom,
            ValidUntil = dto.ValidUntil,
            Status = dto.Status,
            OrganizationId = dto.OrganizationId,
            Organization = org
        };

        _db.Discounts.Add(discount);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Guid id, UpdateDiscountDto dto)
    {
        var discount = await _db.Discounts.FindAsync(id);
        if (discount == null) return;

        discount.Name = dto.Name;
        discount.Amount = dto.Amount;
        discount.ApplicableTo = dto.ApplicableTo;
        discount.ValidFrom = dto.ValidFrom;
        discount.ValidUntil = dto.ValidUntil;
        discount.Status = dto.Status;

        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var discount = await _db.Discounts.FindAsync(id);
        if (discount == null) return;

        _db.Discounts.Remove(discount);
        await _db.SaveChangesAsync();
    }
}
