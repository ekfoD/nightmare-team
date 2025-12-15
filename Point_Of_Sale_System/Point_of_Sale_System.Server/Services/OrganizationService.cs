using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.Business;

namespace Point_of_Sale_System.Server.Services
{
    public class OrganizationService : IOrganizationService
    {
        public Organization ConvertOrganizationFromDTO(Organization org, OrganizationRequest dto)
        {
            org.Name = dto.Name;
            org.Currency = dto.Currency;
            org.Address = dto.Address;
            org.EmailAddress = dto.EmailAddress;
            org.PhoneNumber = dto.PhoneNumber;

            return org;
        }

        public OrganizationRequest ConvertOrganizationToDTO(Organization org)
        {
            var dto = new OrganizationRequest
            {
                Id = org.Id,
                Name = org.Name,
                Currency = org.Currency,
                Address = org.Address,
                EmailAddress = org.EmailAddress,
                PhoneNumber = org.PhoneNumber
            };

            return dto;
        }
    }
}

