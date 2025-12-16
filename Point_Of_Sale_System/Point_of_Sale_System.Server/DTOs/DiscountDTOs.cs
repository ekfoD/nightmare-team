using Point_of_Sale_System.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Point_of_Sale_System.Server.DTOs
{
    public class CreateDiscountDto
    {
        [Required]
        public decimal Amount { get; set; }

        [Required]
        public AppliedToEnum ApplicableTo { get; set; }

        [Required]
        public DateOnly ValidFrom { get; set; }

        [Required]
        public DateOnly ValidUntil { get; set; }

        public StatusEnum Status { get; set; }

        [Required]
        public Guid OrganizationId { get; set; }
    }

    public class UpdateDiscountDto
    {
        [Required]
        public decimal Amount { get; set; }

        [Required]
        public AppliedToEnum ApplicableTo { get; set; }

        [Required]
        public DateOnly ValidFrom { get; set; }

        [Required]
        public DateOnly ValidUntil { get; set; }

        public StatusEnum Status { get; set; }
    }

    public class DiscountResponseDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public AppliedToEnum ApplicableTo { get; set; }
        public DateOnly ValidFrom { get; set; }
        public DateOnly ValidUntil { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
