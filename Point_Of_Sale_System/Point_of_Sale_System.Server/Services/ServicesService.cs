using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Repositories;

public class ServicesService : IServicesService
{
    private readonly IMenuServiceRepository _repo;

    public ServicesService(IMenuServiceRepository repo)
    {
        _repo = repo;
    }
    public Task<IEnumerable<MenuService>> GetAllAsync()
    {
        var all = MenuServiceRepository._services.AsEnumerable();
        return Task.FromResult(all);
    }

    public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
    {
        var filtered = MenuServiceRepository._services
                          .Where(s => s.OrganizationId == organizationId)
                          .AsEnumerable();
        return Task.FromResult(filtered);
    }
        public async Task<MenuService> CreateAsync(MenuService service)
    {
        await _repo.AddAsync(service);
        return service;
    }
}
