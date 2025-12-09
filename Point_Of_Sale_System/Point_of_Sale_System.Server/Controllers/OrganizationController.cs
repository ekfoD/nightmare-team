using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;


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

            var dto = new OrganizationRequest
            {
                Id = organization.Id,
                OwnerId = organization.OwnerId,
                Name = organization.Name,
                OrganizationType = organization.Plan,
                Currency = organization.Currency,
                Address = organization.Address,
                EmailAddress = organization.EmailAddress,
                PhoneNumber = organization.PhoneNumber
            };

            return Ok(dto);
        }
        [HttpPut("{OrganizationId:guid}")]
        public IActionResult UpdateOrganization(Guid OrganizationId, [FromBody] OrganizationRequest dto)
        {
            var org = _organizationRepository.GetOrganizationById(OrganizationId);

            if (org == null)
                return NotFound();
            org.Name = dto.Name;
            org.Currency = dto.Currency;
            org.Address = dto.Address;
            org.EmailAddress = dto.EmailAddress;
            org.PhoneNumber = dto.PhoneNumber;
            org.Plan = dto.OrganizationType;

            _organizationRepository.UpdateOrganization(org);

            return Ok(org);
        }

    }


}


