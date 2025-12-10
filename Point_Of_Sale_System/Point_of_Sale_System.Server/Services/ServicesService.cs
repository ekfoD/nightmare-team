using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Repositories;

public class ServicesService : IServicesService
{
    private readonly IMenuServiceRepository _repo;

    public ServicesService(IMenuServiceRepository repo)
    {
        _repo = repo;
    }

    // Returns all services in memory
    public Task<IEnumerable<MenuService>> GetAllAsync()
    {
        // In-memory repository, just return all services
        var all = MenuServiceRepository._services.AsEnumerable();
        return Task.FromResult(all);
    }

    // Returns all services for a specific organization
    public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
    {
        return _repo.GetAllForOrganizationAsync(organizationId);
    }

    public Task<MenuService?> GetByIdAsync(Guid id)
    {
        return _repo.GetByIdAsync(id);
    }
}
