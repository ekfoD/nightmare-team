namespace Point_of_Sale_System.Server.DTOs
{
    public class OrganizationPutDTO
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public int? CurrencyType { get; set; }
    }
}
