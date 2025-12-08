namespace Point_of_Sale_System.Server.DTOs;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }

    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }

    public required string CustomerName { get; set; }
    public required string CustomerPhone { get; set; }

    public required string Service { get; set; }
    public string? ExtraInfo { get; set; }
}
