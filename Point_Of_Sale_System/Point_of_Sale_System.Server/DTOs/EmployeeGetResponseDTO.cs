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
}
