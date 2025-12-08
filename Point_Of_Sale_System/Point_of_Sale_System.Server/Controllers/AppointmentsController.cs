using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Services;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppointmentService _service;

        public AppointmentsController(AppointmentService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> Create(CreateAppointmentDto dto)
        {
            try
            {
                var result = await _service.CreateAppointmentAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{employeeId:guid}/{date}")]
        public async Task<ActionResult<List<AppointmentDto>>> GetForEmployee(
            Guid employeeId, DateOnly date)
        {
            var result = await _service.GetAppointmentsForEmployee(employeeId, date);
            return Ok(result);
        }
    }

}
