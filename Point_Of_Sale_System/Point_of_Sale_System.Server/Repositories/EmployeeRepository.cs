using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Interfaces;

public class EmployeeRepository : IEmployeeRepository
{
    private static readonly List<Employee> _employees = new();

    public IEnumerable<Employee> GetEmployees(Guid organizationId)
    {
        return _employees.Where(e => e.OrganizationId == organizationId);
    }


    public Employee GetById(Guid id)
    {
        return _employees.FirstOrDefault(e => e.Id == id);
    }

    public Employee AddEmployee(Employee employee)
    {
        _employees.Add(employee);
        return employee;
    }

    public Employee UpdateEmployee(Employee updated)
    {
        var existing = GetById(updated.Id);
        if (existing == null)
            return null;

        existing.Username = updated.Username;
        existing.AccessFlag = updated.AccessFlag;
        existing.Status = updated.Status;

        if (!string.IsNullOrEmpty(updated.PasswordHash))
            existing.PasswordHash = updated.PasswordHash;

        if (!string.IsNullOrEmpty(updated.PasswordSalt))
            existing.PasswordSalt = updated.PasswordSalt;

        return existing;
    }

    public bool DeleteEmployee(Guid id)
    {
        var existing = GetById(id);
        if (existing == null)
            return false;

        _employees.Remove(existing);
        return true;
    }
    public Task<Employee?> GetByIdAsync(Guid id)
    {
        return Task.FromResult(_employees.FirstOrDefault(e => e.Id == id));
    }
}
