using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Dtos;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServicesService _services;
        private readonly IOrganizationRepository _orgRepo;


        public ServicesController(IServicesService services, IOrganizationRepository orgRepo)
        {
            _services = services;
            _orgRepo = orgRepo;
        }

        [HttpGet("{organizationId}")]
        public async Task<IActionResult> GetServices(Guid organizationId)
        {
            var items = await _services.GetAllForOrganizationAsync(organizationId);
            var result = items.Select(s => new 
            {
                name = s.Name,
                duration = s.Duration
            }).ToList();

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateMenuServiceDto dto)
        {
            // convert string duration "HH:MM" -> TimeOnly
            if (!TimeOnly.TryParse(dto.Duration, out var duration))
            {
                return BadRequest("Invalid duration format. Must be HH:MM.");
            }

            var org = _orgRepo.GetOrganizationById(dto.OrganizationId);
            if (org == null) return BadRequest("Invalid organization");

            var service = new MenuService
            {
                Name = dto.Name,
                Duration = duration,
                Price = dto.Price,
                Description = dto.Description,
                Status = dto.Status,
                OrganizationId = dto.OrganizationId,
                Organization = org,
                DiscountId = dto.DiscountId ?? Guid.Empty
            };

            await _services.CreateAsync(service);

            return Ok(new { message = "Service created successfully" });
        }

    }
}
