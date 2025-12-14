using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;

public class ManagementRepository : IManagementRepository
{
    private static readonly Guid fixedOrgId = Guid.Parse("8bbb7afb-d664-492a-bcd2-d29953ab924e");

    // -----------------------------
    // TAXES
    // -----------------------------
    public static readonly List<Tax> _taxes = new()
    {
        new Tax
        {
            Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            Name = "VAT",
            Amount = 21,
            NumberType = NumberTypeEnum.percentage,
            Status = StatusEnum.active,
            OrganizationId = fixedOrgId,
            Timestamp = DateTime.UtcNow
        },
        new Tax
        {
            Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            Name = "Service Fee",
            Amount = 5,
            NumberType = NumberTypeEnum.flat,
            Status = StatusEnum.active,
            OrganizationId = fixedOrgId,
            Timestamp = DateTime.UtcNow
        }
    };

    // -----------------------------
    // GIFTCARDS
    // -----------------------------
    public static readonly List<Giftcard> _giftcards = new()
    {
        new Giftcard
        {
            Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            Balance = 100,
            ValidUntil = new DateOnly(2026, 12, 31),
            Timestamp = DateTime.UtcNow
        },
        new Giftcard
        {
            Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            Balance = 50,
            ValidUntil = new DateOnly(2025, 6, 30),
            Timestamp = DateTime.UtcNow
        }
    };

    // =====================================================
    // TAX CRUD
    // =====================================================

    public IEnumerable<Tax> GetTaxes(Guid organizationId)
        => _taxes.Where(t => t.OrganizationId == organizationId);

    public Tax GetTaxById(Guid taxId)
        => _taxes.FirstOrDefault(t => t.Id == taxId);

    public Tax AddTax(Tax tax)
    {
        tax.Id = Guid.NewGuid();
        tax.Timestamp = DateTime.UtcNow;
        _taxes.Add(tax);
        return tax;
    }

    public Tax UpdateTax(Tax updated)
    {
        var existing = GetTaxById(updated.Id);
        if (existing == null)
            return null;

        existing.Name = updated.Name;
        existing.Amount = updated.Amount;
        existing.NumberType = updated.NumberType;
        existing.Status = updated.Status;

        return existing;
    }

    public bool DeleteTax(Guid taxId)
    {
        var tax = GetTaxById(taxId);
        if (tax == null)
            return false;

        _taxes.Remove(tax);
        return true;
    }

    // =====================================================
    // GIFTCARD CRUD
    // =====================================================

    public IEnumerable<Giftcard> GetGiftcards(Guid organizationId)
        => _giftcards; // giftcards currently global (can be org-scoped later)

    public Giftcard GetGiftcardById(Guid giftcardId)
        => _giftcards.FirstOrDefault(g => g.Id == giftcardId);

    public Giftcard AddGiftcard(Giftcard giftcard)
    {
        giftcard.Id = Guid.NewGuid();
        giftcard.Timestamp = DateTime.UtcNow;
        _giftcards.Add(giftcard);
        return giftcard;
    }

    public Giftcard UpdateGiftcard(Giftcard updated)
    {
        var existing = GetGiftcardById(updated.Id);
        if (existing == null)
            return null;

        existing.Balance = updated.Balance;
        existing.ValidUntil = updated.ValidUntil;

        return existing;
    }

    public bool DeleteGiftcard(Guid giftcardId)
    {
        var giftcard = GetGiftcardById(giftcardId);
        if (giftcard == null)
            return false;

        _giftcards.Remove(giftcard);
        return true;
    }
}
