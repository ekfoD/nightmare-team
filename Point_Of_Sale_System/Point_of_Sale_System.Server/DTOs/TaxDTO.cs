using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs;

public class TaxDTO
{
    public Guid? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public NumberTypeEnum NumberType { get; set; }
    public StatusEnum Status { get; set; }
}
