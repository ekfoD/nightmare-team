using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.Data
{
    public static class DatabaseSeeder
    {
        public static void Seed(PoSDbContext context)
        {
            context.Database.EnsureCreated();

            var fixedOrgId = Guid.Parse("8bbb7afb-d664-492a-bcd2-d29953ab924e");

            // -----------------------------
            // ORGANIZATION (INSERT IF MISSING)
            // -----------------------------
            var organizationExists = context.Organizations.Any(o => o.Id == fixedOrgId);

            if (!organizationExists)
            {
                context.Organizations.Add(new Organization
                {
                    Id = fixedOrgId,
                    Name = "Acme Corporation",
                    Address = "123 Market Street, Springfield",
                    EmailAddress = "info@acme.com",
                    PhoneNumber = "+15551234567",
                    Plan = PlanEnum.service,
                    Currency = CurrencyEnum.dollar,
                    Status = StatusEnum.active,
                    Timestamp = DateTime.UtcNow
                });

                context.SaveChanges(); // Save FIRST so FK relations work
            }

            // -----------------------------
            // INVENTORY ITEMS
            // -----------------------------
            if (!context.InventoryItems.Any())
            {
                context.InventoryItems.AddRange(
                    new InventoryItem
                    {
                        Name = "Shampoo",
                        Quantity = 100,
                        Status = StatusEnum.active,
                        OrganizationId = fixedOrgId
                    },
                    new InventoryItem
                    {
                        Name = "Conditioner",
                        Quantity = 80,
                        Status = StatusEnum.active,
                        OrganizationId = fixedOrgId
                    }
                );
            }

            // -----------------------------
            // TAXES
            // -----------------------------
            if (!context.Taxes.Any())
            {
                context.Taxes.AddRange(
                    new Tax
                    {
                        Name = "VAT",
                        Amount = 21,
                        NumberType = NumberTypeEnum.percentage,
                        Status = StatusEnum.active,
                        OrganizationId = fixedOrgId
                    },
                    new Tax
                    {
                        Name = "Service Fee",
                        Amount = 5,
                        NumberType = NumberTypeEnum.flat,
                        Status = StatusEnum.active,
                        OrganizationId = fixedOrgId
                    }
                );
            }

            // -----------------------------
            // GIFTCARDS
            // -----------------------------
            if (!context.Giftcards.Any())
            {
                context.Giftcards.AddRange(
                    new Giftcard
                    {
                        Balance = 100,
                        ValidUntil = new DateOnly(2026, 12, 31),
                        OrganizationId = fixedOrgId 
                    },
                    new Giftcard
                    {
                        Balance = 50,
                        ValidUntil = new DateOnly(2025, 6, 30),
                        OrganizationId = fixedOrgId
                    }
                );
            }

            context.SaveChanges();
        }
    }
}
