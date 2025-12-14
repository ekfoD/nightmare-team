using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.DTOs;

[Route("api/")]
[ApiController]
public class HomeController : ControllerBase
{

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDTO request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest("Missing username or password");

        // Always return "admin" for demo
        return Ok(new { role = "admin", businessType = "service", businessId = "demo-business-id" });
        //return Ok(new { role = "admin", businessType = "service" });
    }

    [HttpPost("pickBusiness")]
    public IActionResult PickBusiness([FromBody] PickBusinessRequestDTO request)
    {
        if (string.IsNullOrEmpty(request.BusinessId))
            return BadRequest("Missing business ID");

        // Always return success for demo
        return Ok(new { businessType = "service", businessId = request.BusinessId });
    }
}


// Owneris -> organization -> businessId

// Admin -> list organizations

// authContext -> user information (role, businessType, etc.)