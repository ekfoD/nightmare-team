using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public Guid MenuServiceId { get; set; }
        public string? ServiceName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required string CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? ExtraInfo { get; set; }
        public Guid OrganizationId { get; set; }
        public PaymentEnum PaymentStatus { get; set; }
    }

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
}