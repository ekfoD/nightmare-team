using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IOrganizationService
    {
        Organization ConvertOrganizationFromDTO(Organization org, OrganizationRequest dto);

        OrganizationRequest ConvertOrganizationToDTO(Organization org);
    }
}