using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
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

        [HttpGet("full/{organizationId}")]
        public async Task<IActionResult> GetFullServices(Guid organizationId)
        {
            var services = await _services.GetAllForOrganizationAsync(organizationId);

            var result = services.Select(s => new MenuServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Duration = s.Duration, 
                Price = s.Price,
                Description = s.Description,
                Status = s.Status
            }).ToList();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateMenuServiceDto dto)
        {
            var org = _orgRepo.GetOrganizationById(dto.OrganizationId);
            if (org == null) return BadRequest("Invalid organization");

            var service = new MenuService
            {
                Name = dto.Name,
                Duration = dto.Duration,
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
