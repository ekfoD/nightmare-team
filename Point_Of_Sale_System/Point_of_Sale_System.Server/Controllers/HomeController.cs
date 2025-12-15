using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;

using Microsoft.AspNetCore.Authorization;     // [Authorize], [AllowAnonymous]
using Microsoft.AspNetCore.Mvc;                // ControllerBase, HttpGet, etc.
using System.Security.Claims;                  // Claim, ClaimTypes
using Microsoft.IdentityModel.Tokens;          // SymmetricSecurityKey, SigningCredentials, TokenValidationParameters
using System.IdentityModel.Tokens.Jwt;         // JwtSecurityToken, JwtSecurityTokenHandler
using System.Text;
using System.Threading.Tasks;
using Point_of_Sale_System.Server.Models.Entities.Business;                             // Encoding.UTF8


[Route("api/")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IOrganizationRepository _organizationRepository;

    public HomeController(IConfiguration config, IOrganizationRepository organizationRepositor)
    {
        _config = config;
        _organizationRepository = organizationRepositor;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDTO request)
    {
        // validate user credentials
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest("Missing username or password");


        // JWT stuff
        var claims = new[]
        {
            new Claim("name", "John"),
            new Claim("role", "admin"),
            new Claim("businessId", "123"),
            new Claim("businessType", "order")
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        // Return the token 
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    [Authorize]
    [HttpPost("pickBusiness")]
    public async Task<IActionResult> PickBusiness([FromBody] PickBusinessRequestDTO request)
    {
        if (string.IsNullOrEmpty(request.BusinessId))
            return BadRequest("Missing business ID");


        Guid organizationId = Guid.Parse(request.BusinessId);
        var organization = await _organizationRepository.GetOrganizationAsync(organizationId);

        var user = HttpContext.User;

        var name = user.FindFirst("name")?.Value;
        var role = user.FindFirst("role")?.Value;

        
        // Build NEW claims
        var claims = new[]
        {
        new Claim("name", name),
        new Claim("role", "admin"),
        new Claim("businessId", request.BusinessId),
        new Claim("businessType", organization.Plan)
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        // Return NEW token
        return Ok(new { token = jwt });
    }

}


// Owneris -> organization -> businessId

// Admin -> list organizations

// authContext -> user information (role, businessType, etc.)