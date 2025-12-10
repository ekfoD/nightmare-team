using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IEmployeeRepository
    {
        IEnumerable<Employee> GetEmployees(Guid organizationId);
        Task<IEnumerable<Employee>> GetEmployeesAsync(Guid organizationId);
        Employee GetById(Guid employeeId);
        Employee AddEmployee(Employee employee);
        Employee UpdateEmployee(Employee employee);
        bool DeleteEmployee(Guid employeeId);
        Task<Employee?> GetByIdAsync(Guid id);
    }
}