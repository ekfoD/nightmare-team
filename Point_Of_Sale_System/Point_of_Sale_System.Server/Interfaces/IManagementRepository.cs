using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;


namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IManagementRepository
    {
        // TAX
        IEnumerable<Tax> GetTaxes(Guid organizationId);
        Tax GetTaxById(Guid taxId);
        Tax AddTax(Tax tax);
        Tax UpdateTax(Tax tax);
        bool DeleteTax(Guid taxId);

        // GIFTCARD
        IEnumerable<Giftcard> GetGiftcards(Guid organizationId);
        Giftcard GetGiftcardById(Guid giftcardId);
        Giftcard AddGiftcard(Giftcard giftcard);
        Giftcard UpdateGiftcard(Giftcard giftcard);
        bool DeleteGiftcard(Guid giftcardId);
    }

}