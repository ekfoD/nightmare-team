namespace Point_of_Sale_System.Server.DTOs
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public int AccessFlag { get; set; }
        public string Status { get; set; }
        public Guid OrganizationId { get; set; } // just the ID, no Organization object
    }
}
