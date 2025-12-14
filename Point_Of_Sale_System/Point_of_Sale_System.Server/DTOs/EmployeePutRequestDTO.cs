namespace Point_of_Sale_System.Server.DTOs
{
    public class EmployeePutRequestDTO
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public int AccessFlag { get; set; }
        public string? Status { get; set; } 
        public required Guid OrganizationId { get; set; }
    }
}
