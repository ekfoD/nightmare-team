using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Dtos;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
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
            .Where(s => s.OrganizationId == organizationId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuServiceDto>> GetFullDtosForOrganizationAsync(Guid organizationId)
    {
        return await _db.MenuServices
            .Include(s => s.Organization)
            .Where(s => s.OrganizationId == organizationId)
            .Select(s => new MenuServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Duration = s.Duration,
                Price = s.Price,
                Description = s.Description,
                Status = s.Status,
                Currency = s.Organization != null ? s.Organization.Currency : CurrencyEnum.dollar
            })
            .ToListAsync();
    }

    public async Task CreateAsync(CreateMenuServiceDto dto)
    {
        Organization? org = await _db.Organizations.FindAsync(dto.OrganizationId);
        var service = new MenuService
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Duration = dto.Duration,
            Price = dto.Price,
            Description = dto.Description,
            Status = dto.Status,
            OrganizationId = dto.OrganizationId,
            Organization = org!,
            DiscountId = dto.DiscountId,
            TaxId = dto.TaxId
        };

        _db.MenuServices.Add(service);
        await _db.SaveChangesAsync();
    }

    public async Task<MenuServiceDto?> UpdateAsync(Guid id, CreateMenuServiceDto dto)
    {
        var service = await _db.MenuServices
            .Include(s => s.Organization)
            .FirstOrDefaultAsync(s => s.Id == id && s.OrganizationId == dto.OrganizationId);

        if (service == null)
            return null;

        service.Name = dto.Name;
        service.Duration = dto.Duration;
        service.Price = dto.Price;
        service.Description = dto.Description;
        service.Status = dto.Status;
        service.DiscountId = dto.DiscountId ?? Guid.Empty;

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
            .Where(s => s.OrganizationId == organizationId && s.Status == StatusEnum.active)
            .Select(s => new
            {
                name = s.Name,
                duration = s.Duration
            })
            .ToListAsync();
    }
}
