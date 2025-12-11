using Microsoft.AspNetCore.Mvc;

namespace Point_of_Sale_System.Server.Controllers;




[ApiController]
[Route("api/[controller]")]
public class OrganizationController : ControllerBase
{
    private readonly PoSDbContext  _context;

}
