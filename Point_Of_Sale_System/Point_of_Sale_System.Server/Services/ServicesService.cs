using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Dtos;
using Point_of_Sale_System.Server.Repositories;
using Point_of_Sale_System.Server.Enums;

public class ServicesService : IServicesService
{
    private readonly IMenuServiceRepository _repo;
    private readonly IOrganizationRepository _organizationRepo;

    public ServicesService(IMenuServiceRepository repo, IOrganizationRepository organizationRepo)
    {
        _repo = repo;
        _organizationRepo = organizationRepo;
    }

    public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
    {
        return _repo.GetAllForOrganizationAsync(organizationId);
    }

    public async Task<IEnumerable<MenuServiceDto>> GetFullDtosForOrganizationAsync(Guid organizationId)
    {
        var services = await _repo.GetAllForOrganizationAsync(organizationId);
        var organization = _organizationRepo.GetOrganizationById(organizationId);

        return services.Select(s => new MenuServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            Duration = s.Duration,
            Price = s.Price,
            Description = s.Description,
            Status = s.Status,
            Currency = organization.Currency
        });
    }

    public async Task CreateAsync(CreateMenuServiceDto dto)
    {
        var org = _organizationRepo.GetOrganizationById(dto.OrganizationId);
        var service = new MenuService
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Duration = dto.Duration,
            Price = dto.Price,
            Description = dto.Description,
            Status = dto.Status,
            OrganizationId = dto.OrganizationId,
            Organization = org,
            DiscountId = dto.DiscountId ?? Guid.Empty
        };

        await _repo.AddAsync(service);
    }

    public async Task<MenuServiceDto?> UpdateAsync(Guid id, CreateMenuServiceDto dto)
    {
        var services = await _repo.GetAllForOrganizationAsync(dto.OrganizationId);
        var existing = services.FirstOrDefault(s => s.Id == id);

        if (existing == null)
            return null;

        // ALL assignments here
        existing.Name = dto.Name;
        existing.Duration = dto.Duration;
        existing.Price = dto.Price;
        existing.Description = dto.Description;
        existing.Status = dto.Status;
        existing.DiscountId = dto.DiscountId ?? Guid.Empty;

        await _repo.UpdateAsync(existing);

        return new MenuServiceDto
        {
            Id = existing.Id,
            Name = existing.Name,
            Duration = existing.Duration,
            Price = existing.Price,
            Description = existing.Description,
            Status = existing.Status
        };
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return _repo.DeleteAsync(id);
    }

    public async Task<IEnumerable<object>> GetActiveForOrganizationAsync(Guid organizationId)
    {
        var services = await _repo.GetAllForOrganizationAsync(organizationId);

        return services
            .Where(s => s.Status == StatusEnum.active)
            .Select(s => new
            {
                name = s.Name,
                duration = s.Duration
            });
    }
}
