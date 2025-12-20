using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Microsoft.AspNetCore.Authorization;

namespace Point_of_Sale_System.Server.Controllers
{
    [Authorize(Roles = "admin,owner,manager,employee")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptController : ControllerBase
    {
        private readonly IReceiptService _receipts;

        public ReceiptController (IReceiptService receipts)
        {
            _receipts = receipts;
        }
        
        [HttpGet("appointment/{organizationId}")]
        public async Task<IActionResult> GetApptReceiptsAsync(Guid organizationId)
        {
            var items = await _receipts.GetAllApptsReceiptsAsync(organizationId);
            return Ok(items);
        }

        [HttpPost("appointment")]
        public async Task<IActionResult> CreateApptReceipt(CreateApptReceiptDto dto)
        {
            await _receipts.CreateApptReceipt(dto);

            return Ok(new { message = "Receipt created successfully" });
        }


    }
}