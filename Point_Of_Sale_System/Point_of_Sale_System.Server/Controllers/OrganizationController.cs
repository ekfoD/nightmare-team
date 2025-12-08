using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Interfaces;


namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationrepository _organizationRepository;

        public OrganizationController(IOrganizationrepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        [HttpGet("{OrganizationId:guid}")]
        public IActionResult GetOrganizationById(Guid OrganizationId)
        {
            var organization = _organizationRepository.GetOrganizationById(OrganizationId);

            if (organization == null)
                return NotFound(new { message = "Organization not found" });

            return Ok(organization);
        }

        
    }
}