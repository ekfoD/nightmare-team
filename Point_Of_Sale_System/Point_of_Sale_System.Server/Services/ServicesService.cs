using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Interfaces;

public class ServicesService : IServicesService
{
    private readonly PoSDbContext _db;

    public ServicesService(PoSDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
    {
        return await _db.MenuServices
            .Include(s => s.Taxes)
            .Where(s => s.OrganizationId == organizationId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuServiceDto>> GetFullDtosForOrganizationAsync(Guid organizationId)
    {
        return await _db.MenuServices
            .Include(s => s.Organization)
            .Include(s => s.Taxes)
            .Where(s => s.OrganizationId == organizationId)
            .Select(s => new MenuServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Duration = s.Duration,
                Price = s.Price,
                Description = s.Description,
                Status = s.Status,
                Currency = s.Organization.Currency,

                Taxes = s.Taxes.Select(t => new TaxDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Amount = t.Amount,
                    NumberType = (int) t.NumberType,
                    Status = (int) t.Status
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task CreateAsync(CreateMenuServiceDto dto)
    {
        var organization = await _db.Organizations.FindAsync(dto.OrganizationId)
            ?? throw new Exception("Organization not found");

        var taxes = dto.TaxIds.Any()
            ? await _db.Taxes
                .Where(t => dto.TaxIds.Contains(t.Id))
                .ToListAsync()
            : new List<Tax>();

        var service = new MenuService
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Duration = dto.Duration,
            Price = dto.Price,
            Description = dto.Description,
            Status = dto.Status,
            OrganizationId = dto.OrganizationId,
            Organization = organization,
            DiscountId = dto.DiscountId,
            Taxes = taxes
        };

        _db.MenuServices.Add(service);
        await _db.SaveChangesAsync();
    }
    public async Task<MenuServiceDto?> UpdateAsync(Guid id, CreateMenuServiceDto dto)
    {
        var service = await _db.MenuServices
            .Include(s => s.Organization)
            .Include(s => s.Taxes)
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.OrganizationId == dto.OrganizationId);

        if (service == null)
            return null;

        service.Name = dto.Name;
        service.Duration = dto.Duration;
        service.Price = dto.Price;
        service.Description = dto.Description;
        service.Status = dto.Status;
        service.DiscountId = dto.DiscountId;
        
        service.Taxes.Clear();

        if (dto.TaxIds.Any())
        {
            var taxes = await _db.Taxes
                .Where(t => dto.TaxIds.Contains(t.Id))
                .ToListAsync();

            foreach (var tax in taxes)
                service.Taxes.Add(tax);
        }

        await _db.SaveChangesAsync();

        return new MenuServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Duration = service.Duration,
            Price = service.Price,
            Description = service.Description,
            Status = service.Status,
            Currency = service.Organization.Currency
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var service = await _db.MenuServices.FindAsync(id);
        if (service == null)
            return false;

        _db.MenuServices.Remove(service);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<object>> GetActiveForOrganizationAsync(Guid organizationId)
    {
        return await _db.MenuServices
            .Where(s =>
                s.OrganizationId == organizationId &&
                s.Status == StatusEnum.active)
            .Select(s => new
            {
                name = s.Name,
                duration = s.Duration
            })
            .ToListAsync();
    }
}
