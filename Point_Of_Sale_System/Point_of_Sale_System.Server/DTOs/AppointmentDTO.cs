namespace Point_of_Sale_System.Server.DTOs;

public class AppointmentDto
{
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public Guid MenuServiceId { get; set; }
        public string? ServiceName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? ExtraInfo { get; set; }
}
