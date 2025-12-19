namespace Point_of_Sale_System.Server.DTOs
{
    public class EmployeeGetResponseDTO
    {
        public required string employeeId { get; set; }
        public required string username { get; set; }
        public required int accessFlag { get; set; }
        public required string status { get; set; }
        public required string timestamp { get; set; }
    }

    public class EmployeePostRequestDTO
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required int AccessFlag{ get; set; }
        public required string Status { get; set; } // Yes, both status and access flag is an Enum, thank the other team for doing this
        public required Guid OrganizationId { get; set; }
    }

    public class EmployeePutRequestDTO
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public int AccessFlag { get; set; }
        public string? Status { get; set; } 
        public required Guid OrganizationId { get; set; }
    }
}
