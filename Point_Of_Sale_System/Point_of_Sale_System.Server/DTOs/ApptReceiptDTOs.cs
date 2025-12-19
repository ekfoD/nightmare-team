using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs
{
    public class CreateApptReceiptDto
    {
        public Guid OrganizationId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public PaymentEnum PaymentStatus { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal ServicePrice { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;

        public Guid PaymentId { get; set; }

        public ICollection<TaxReceiptDto> Taxes { get; set; } = new List<TaxReceiptDto>();
        public ICollection<DiscountReceiptDto> Discounts { get; set; } = new List<DiscountReceiptDto>();
    }

    public class AppointmentReceiptDto
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public DateTime Timestamp {get; set; }
        public required string CustomerName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid PaymentId { get; set; }
        public required string PaymentStatus { get; set; }
        public required string ServiceName { get; set; }
        public required decimal ServicePrice { get; set; }
        public required string EmployeeName { get; set; }
        public List<TaxReceiptDto> Taxes { get; set; } = new();
        public List<DiscountReceiptDto> Discounts { get; set; } = new();
    }


    public class TaxReceiptDto
    {
        public Guid? Id { get; set; }
        public required string Name { get; set; }
        public required decimal AffectedAmount { get; set; }
        public required decimal Amount { get; set; }
        public NumberTypeEnum NumberType { get; set; }

    }

    public class DiscountReceiptDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required decimal Procentage { get; set; }                
        public required decimal AffectedAmount { get; set; }  
    }

}
