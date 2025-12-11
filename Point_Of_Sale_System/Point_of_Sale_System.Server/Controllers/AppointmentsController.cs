using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models;

namespace Point_of_Sale_System.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;
        private readonly IOrganizationRepository _orgRepo;
        private readonly IAppointmentRepository _appointmentRepo;

        public AppointmentsController(IAppointmentService service, IOrganizationRepository orgRepo, IAppointmentRepository appointmentRepo)
        {
            _service = service;
            _orgRepo = orgRepo;
            _appointmentRepo = appointmentRepo;
        }

        [HttpGet("{organizationId}/{date}")]
        public async Task<IActionResult> GetAppointments(Guid organizationId, DateTime date)
        {
            var items = await _service.GetAppointmentsForDateAsync(organizationId, date);
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
        
        [HttpGet]
        public async Task<IActionResult> GetAllForTest()
        {
            var date = new DateTime(2025, 1, 1, 11, 0, 0);
            var org = _orgRepo.GetAll().FirstOrDefault();
            if (org == null)
                return Ok(new List<Appointment>());
            var appts = await _appointmentRepo.GetByDateAsync(org.Id, date);
            return Ok(appts);
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
