using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServicesService _services;

        public ServicesController(IServicesService services)
        {
            _services = services;
        }

        [HttpGet("{organizationId}")]
        public async Task<IActionResult> GetServices(Guid organizationId) //get all services despite organization until multi-org is implemented
        {
            var items = await _services.GetAllForOrganizationAsync(organizationId);
            var result = items.Select(s => new 
            {
                name = s.Name,
                duration = s.Duration
            }).ToList();

            return Ok(result);
        }

    }
}
