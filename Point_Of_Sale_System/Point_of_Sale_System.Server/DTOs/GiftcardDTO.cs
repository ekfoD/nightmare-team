using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.DTOs;

public class GiftcardDTO
{
    public Guid? Id { get; set; }
    public required decimal Balance { get; set; }
    public DateOnly ValidUntil { get; set; }
}