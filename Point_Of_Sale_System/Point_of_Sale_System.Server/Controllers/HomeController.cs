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
        return Ok(new { role = "admin" });
    }
}

