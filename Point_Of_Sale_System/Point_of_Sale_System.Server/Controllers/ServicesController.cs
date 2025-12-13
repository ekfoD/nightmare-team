using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Dtos;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServicesService _services;
        private readonly IOrganizationRepository _orgRepo;



        public ServicesController (IServicesService services)
        {
            _services = services;
            _orgRepo = orgRepo;
        }

        [HttpGet("{organizationId}")]
        public async Task<IActionResult> GetServices(Guid organizationId)
        {
            var result = await _services.GetActiveForOrganizationAsync(organizationId);
            return Ok(result);
        }

        [HttpGet("full/{organizationId}")]
        public async Task<IActionResult> GetFullServices(Guid organizationId)
        {
            var result = await _services.GetFullDtosForOrganizationAsync(organizationId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateMenuServiceDto dto)
        {
            await _services.CreateAsync(dto);

            return Ok(new { message = "Service created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] CreateMenuServiceDto dto)
        {
            var updated = await _services.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound("Service not found.");

            return Ok(updated);
        }

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
