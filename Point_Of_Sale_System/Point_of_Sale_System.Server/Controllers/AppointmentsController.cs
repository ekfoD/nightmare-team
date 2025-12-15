using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;


        public AppointmentsController(IAppointmentService service)
        {
            _service = service;

        }

        [HttpGet("{organizationId}/{date}")]
        public async Task<IActionResult> GetAppointments(Guid organizationId, DateTime date)
        {
            var items = await _service.GetAppointmentsForDateAsync(organizationId, date);
            return Ok(items);
        }

        [HttpGet("pending/{organizationId}")]
        public async Task<IActionResult> GetPendingAppointments(Guid organizationId)
        {
            var items = await _service.GetPendingAppointmentsAsync(organizationId);
            return Ok(items);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateAppointmentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return Ok(created);
        }

        [HttpPut("{id}/edit")]
        public async Task<ActionResult<AppointmentDto>> Update(Guid id, [FromBody] CreateAppointmentDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}/delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return Ok(new { message = "Appointment deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
