namespace Point_of_Sale_System.Server.DTOs;
public class CreateAppointmentDto
{
    public Guid EmployeeId { get; set; }
    public Guid OrganizationId { get; set; }
    public Guid MenuServiceId { get; set; }
    public DateTime StartTime { get; set; }
    public string CustomerName { get; set; } = null!;
    public string CustomerPhone { get; set; } = null!;
    public string? ExtraInfo { get; set; }
}
