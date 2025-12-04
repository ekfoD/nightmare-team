using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Enums;

[Route("[controller]/[action]")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Items()
    {
        return Ok();
    }

    [HttpPost("{name}/{password}")]
    public IActionResult Authenticate(string name, string password)
    {
        if (String.IsNullOrEmpty(name) || String.IsNullOrEmpty(password))
        return BadRequest();
        
        return Ok(RoleEnum.Admin);
    }
}