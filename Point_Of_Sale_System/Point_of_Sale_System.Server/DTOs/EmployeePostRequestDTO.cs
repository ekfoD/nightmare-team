namespace Point_of_Sale_System.Server.DTOs
{
    public class EmployeePostRequestDTO
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required int AccessFlag{ get; set; }
        public required string Status { get; set; } // Yes, both status and access flag is an Enum, thank the other team for doing this
        public required Guid OrganizationId { get; set; }
    }
}
