using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;
using Point_of_Sale_System.Server.Services;
using Point_of_Sale_System.Server.Models.Entities.Business;


namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationRepository _organizationRepository;

        private readonly IOrganizationService _organizationService;

        public OrganizationController(IOrganizationRepository organizationRepository, IOrganizationService organizationService)
        {
            _organizationRepository = organizationRepository;
            _organizationService = organizationService;
        }

        [HttpGet("{OrganizationId:guid}")]
        public IActionResult GetOrganizationById(Guid OrganizationId)
        {
            var organization = _organizationRepository.GetOrganizationById(OrganizationId);

            if (organization == null)
                return NotFound(new { message = "Organization not found" });

            var dto = _organizationService.ConvertOrganizationToDTO(organization);

            return Ok(dto);
        }
        [HttpPut("{OrganizationId:guid}")]
        public IActionResult UpdateOrganization(Guid OrganizationId, [FromBody] OrganizationRequest dto)
        {
            var org = _organizationRepository.GetOrganizationById(OrganizationId);

            if (org == null)
                return NotFound();
            var orgUpdate = _organizationService.ConvertOrganizationFromDTO(org, dto);

            _organizationRepository.UpdateOrganization(orgUpdate);

            return Ok(org);
        }

    }


}


