using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Data;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Interfaces;

public class ReceiptService : IReceiptService
{
    private readonly PoSDbContext _db;

    public ReceiptService(PoSDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<AppointmentReceiptDto>> GetAllApptsReceiptsAsync(Guid organizationId)
    {
        var receipts = await _db.AppointmentReceipts
            .Include(r => r.Taxes)
            .Include(r => r.Discounts)
            .Where(r => r.OrganizationId == organizationId)
            .OrderByDescending(r => r.Timestamp)
            .ToListAsync();

        // Map to DTOs
        var dtoList = receipts.Select(r => new AppointmentReceiptDto
        {
            Id = r.Id,
            OrganizationId = r.OrganizationId,
            Timestamp = r.Timestamp,
            CustomerName = r.CustomerName,
            StartTime = r.StartTime,
            EndTime = r.EndTime,
            PaymentStatus = r.PaymentStatus.ToString(),
            ServiceName = r.ServiceName,
            ServicePrice = r.ServicePrice,
            EmployeeId = r.EmployeeId,
            EmployeeName = r.EmployeeName,
            PaymentId = r.PaymentId,
            Taxes = r.Taxes.Select(t => new TaxReceiptDto
            {
                Id = t.Id,
                Name = t.Name,
                Amount = t.Amount,
                AffectedAmount = t.AffectedAmount,
                NumberType = t.NumberType
            }).ToList(),
            Discounts = r.Discounts.Select(d => new DiscountReceiptDto
            {
                Id = d.Id,
                Name = d.Name,
                Procentage = d.Procentage,
                AffectedAmount = d.AffectedAmount
            }).ToList()
        }).ToList();

        return dtoList;
    }

    public async Task CreateApptReceipt(CreateApptReceiptDto dto)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrganizationId = dto.OrganizationId,
            Tip = 0,
            Amount = dto.ServicePrice,
        };

        var receipt = new AppointmentReceipt
        {   
            OrganizationId = dto.OrganizationId,
            CustomerName = dto.CustomerName,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            PaymentStatus = dto.PaymentStatus,
            ServiceName = dto.ServiceName,
            ServicePrice = dto.ServicePrice,
            EmployeeId = dto.EmployeeId,
            EmployeeName = dto.EmployeeName,
            PaymentId = payment.Id,
            Payment = payment,
            Taxes = dto.Taxes.Select(t => new TaxReceipt
            {
                Name = t.Name,
                Amount = t.Amount,
                AffectedAmount = t.AffectedAmount,
                NumberType = t.NumberType
            }).ToList(),
            Discounts = dto.Discounts.Select(d => new DiscountReceipt
            {
                Name = d.Name,
                Procentage = d.Procentage,
                AffectedAmount = d.AffectedAmount
            }).ToList(),
        };

        _db.AppointmentReceipts.Add(receipt);
        await _db.SaveChangesAsync();
    }


}
