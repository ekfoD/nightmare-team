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

        [HttpPut("{id}/refund")]
        public async Task<IActionResult> RefundReceipt(Guid id)
        {
            try
            {
                var receipt = await _receipts.RefundReceiptAsync(id);
                if (receipt == null) return NotFound();

                return Ok(receipt);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred.", detail = ex.Message });
            }
        }


    }
}