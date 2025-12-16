using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Enums;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService _discounts;

        public DiscountController(IDiscountService discounts)
        {
            _discounts = discounts;
        }

        [Authorize(Roles = "admin,owner,manager,employee")]
        [HttpGet("organization/{organizationId}")]
        public async Task<IActionResult> GetAll(Guid organizationId)
        {
            return Ok(await _discounts.GetAllByOrganizationAsync(organizationId));
        }

        [Authorize(Roles = "admin,owner,manager,employee")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var discount = await _discounts.GetByIdAsync(id);
            return discount == null ? NotFound() : Ok(discount);
        }

        [Authorize(Roles = "admin,owner,manager,employee")]
        [HttpGet("organization/{organizationId}/items")]
        public async Task<IActionResult> GetItemDiscounts(Guid organizationId)
        {
            var discounts = await _discounts.GetAllByOrganizationAsync(organizationId);

            var itemDiscounts = discounts
                .Where(d => d.ApplicableTo == AppliedToEnum.item)
                .Select(d => new 
                {
                    d.Id,
                    d.Name,
                    d.Amount
                });

            return Ok(itemDiscounts);
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateDiscountDto dto)
        {
            await _discounts.CreateAsync(dto);
            return Ok(new { message = "Discount created" });
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateDiscountDto dto)
        {
            await _discounts.UpdateAsync(id, dto);
            return Ok(new { message = "Discount updated" });
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _discounts.DeleteAsync(id);
            return Ok(new { message = "Discount deleted" });
        }
    }
}
