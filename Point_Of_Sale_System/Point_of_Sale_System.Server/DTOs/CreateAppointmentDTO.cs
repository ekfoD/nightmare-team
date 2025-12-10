namespace Point_of_Sale_System.Server.DTOs;
public class CreateAppointmentDto
{
    public Guid OrganizationId { get; set; }
    public required string EmployeeName { get; set; }
    public required string ServiceName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public required string CustomerName { get; set; } 
    public string CustomerPhone { get; set; } = null!;
    public string? ExtraInfo { get; set; }
}
