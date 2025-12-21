using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServicesService _services;

        public ServicesController (IServicesService services)
        {
            _services = services;
        }

        [Authorize(Roles = "admin,owner,manager,employee")]
        [HttpGet("{organizationId}")]
        public async Task<IActionResult> GetServices(Guid organizationId)
        {
            var result = await _services.GetActiveForOrganizationAsync(organizationId);
            return Ok(result);
        }

        [Authorize(Roles = "admin,owner,manager,employee")]
        [HttpGet("full/{organizationId}")]
        public async Task<IActionResult> GetFullServices(Guid organizationId)
        {
            var result = await _services.GetFullDtosForOrganizationAsync(organizationId);
            return Ok(result);
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateMenuServiceDto dto)
        {
            await _services.CreateAsync(dto);

            return Ok(new { message = "Service created successfully" });
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] CreateMenuServiceDto dto)
        {
            var updated = await _services.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound("Service not found.");

            return Ok(updated);
        }

        [Authorize(Roles = "admin,owner,manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            var deleted = await _services.DeleteAsync(id);
            if (!deleted)
                return NotFound("Service not found.");

            return NoContent();
        }
    }
}
