using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

public class ServicesService : IServicesService
{
    private readonly IMenuServiceRepository _repo;
    public ServicesService(IMenuServiceRepository repo)
    {
        _repo = repo;
    }

    public Task<IEnumerable<MenuService>> GetAllAsync()
    {
        // If repo has an async method:
        if (_repo.GetType().GetMethod("GetAllAsync") != null)
            return (Task<IEnumerable<MenuService>>)_repo.GetType().GetMethod("GetAllAsync")!.Invoke(_repo, null)!;

        // Else wrap synchronous GetAll
        var all = (IEnumerable<MenuService>)_repo.GetType().GetMethod("GetAll")!.Invoke(_repo, null)!;
        return Task.FromResult(all);
    }

    public Task<IEnumerable<MenuService>> GetAllForOrganizationAsync(Guid organizationId)
    {
        // try repo method name
        if (_repo.GetType().GetMethod("GetAllForOrganizationAsync") != null)
            return (Task<IEnumerable<MenuService>>)_repo.GetType()
                .GetMethod("GetAllForOrganizationAsync")!.Invoke(_repo, new object[] { organizationId })!;

        if (_repo.GetType().GetMethod("GetAllForOrganization") != null)
        {
            var result = (IEnumerable<MenuService>)_repo.GetType()
                .GetMethod("GetAllForOrganization")!.Invoke(_repo, new object[] { organizationId })!;
            return Task.FromResult(result);
        }

        // fallback: filter GetAll by OrganizationId if available
        var all = (IEnumerable<MenuService>)_repo.GetType().GetMethod("GetAll")!.Invoke(_repo, null)!;
        var filtered = all.Where(s => s.OrganizationId == organizationId);
        return Task.FromResult(filtered);
    }

    public Task<MenuService?> GetByIdAsync(Guid id)
    {
        if (_repo.GetType().GetMethod("GetByIdAsync") != null)
            return (Task<MenuService?>)_repo.GetType().GetMethod("GetByIdAsync")!.Invoke(_repo, new object[] { id })!;

        var m = (MenuService?)_repo.GetType().GetMethod("GetById")!.Invoke(_repo, new object[] { id })!;
        return Task.FromResult(m);
    }
}
