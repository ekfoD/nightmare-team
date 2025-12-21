using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IReceiptService
    {
        Task<IEnumerable<AppointmentReceiptDto>> GetAllApptsReceiptsAsync(Guid organizationId);
        Task CreateApptReceipt(CreateApptReceiptDto dto);

    }
}
