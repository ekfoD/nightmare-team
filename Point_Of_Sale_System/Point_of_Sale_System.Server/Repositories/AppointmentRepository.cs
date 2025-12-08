using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly List<Schedule> _appointments = new();

    public Task<Schedule> CreateAsync(Schedule appointment)
    {
        _appointments.Add(appointment);
        return Task.FromResult(appointment);
    }

    public Task<List<Schedule>> GetForEmployeeAsync(Guid employeeId, DateOnly date)
    {
        var result = _appointments
            .Where(a => a.EmployeeId == employeeId && a.Date == date)
            .ToList();

        return Task.FromResult(result);
    }

    public Task<Schedule?> GetByIdAsync(Guid id)
    {
        return Task.FromResult(_appointments.FirstOrDefault(a => a.Id == id));
    }
}
