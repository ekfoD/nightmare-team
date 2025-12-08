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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _services.GetAllAsync();
            return Ok(items.Select(s => s.Name).ToList());
        }
    }
}
