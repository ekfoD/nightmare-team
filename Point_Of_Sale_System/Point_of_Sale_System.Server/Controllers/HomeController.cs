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
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Services;                             // Encoding.UTF8


[Route("api/")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IAuthService _authService;

    public HomeController(IConfiguration config, IOrganizationRepository organizationRepositor, IAuthService authService)
    {
        _config = config;
        _organizationRepository = organizationRepositor;
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
    {

        // validate user credentials
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest("Missing username or password");


        string role = string.Empty;
        string name;
        string businessId = string.Empty;
        string businessType = string.Empty;

        if (await _authService.SuperAdminExistsAsync(request.Username))
        {
            var valid = await _authService
            .ValidateSuperAdminCredentialsAsync(
                request.Username,
                request.Password
            );

            if (!valid)
                return Unauthorized("Invalid credentials");
            role = "admin";
            businessType = "service";
            businessId = "";
            name = request.Username;
        }
        else if (await _authService.EmployeeExistsAsync(request.Username))
        {
            var valid = await _authService
            .ValidateEmployeeCredentialsAsync(
                request.Username,
                request.Password
            );

            if (!valid)
                return Unauthorized("Invalid credentials");

            var employee = await _authService.GetEmployeeFromUsernameAsync(request.Username);
            var organization = await _authService.GetOrganizationFromEmployeeAsync(employee.Id);

            businessType = organization.Plan.ToString().ToLower();
            businessId = organization.Id.ToString();
            name = employee.Username;

            if (employee.AccessFlag == 2) //owner
            {
                role = "owner";
            }
            else if (employee.AccessFlag == 3) //manager
            {
                role = "manager";
            }
            else if (employee.AccessFlag == 4) //employee
            {
                role = "employee";
            }

        }
        else
        {
            return BadRequest("Wrong information");
        }

        var claims = new[]
        {
            new Claim("name", name),
            new Claim("role", role),
            new Claim("businessId", businessId),
            new Claim("businessType", businessType)
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

        /////////////////////     FOR TESTING AS ADMIN     ///////////////////////////////////////
        // JWT stuff
        // var claims = new[]
        // {
        //     new Claim("name", "John"),
        //     new Claim("role", "admin"),
        //     new Claim("businessId", ""),
        //     new Claim("businessType", "order")
        // };

        // var key = new SymmetricSecurityKey(
        //     Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        // );

        // var token = new JwtSecurityToken(
        //     issuer: _config["Jwt:Issuer"],
        //     audience: _config["Jwt:Audience"],
        //     claims: claims,
        //     expires: DateTime.UtcNow.AddHours(1),
        //     signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        // );

        // // Return the token 
        // return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
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
        new Claim("businessType", organization.Plan.ToString())
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