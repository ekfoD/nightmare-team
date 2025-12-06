using Microsoft.AspNetCore.Mvc;
using Point_of_Sale_System.Server.Models;


[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly ScheduleService _service;


    public ScheduleController(ScheduleService service)
    {
        _service = service;
    }


    // GET /api/schedule/2025-11-28
    [HttpGet("{date}")]
    public async Task<IActionResult> GetByDate(string date)
    {
        if (!DateOnly.TryParse(date, out var d))
        return BadRequest("Invalid date format.");


        var schedules = await _service.GetDailyAsync(d);
        Console.WriteLine("TEST: Schedule count=" + (await _service.GetDailyAsync(new DateOnly(2025, 11, 28))).Count());
        return Ok(schedules);
    }


    // GET /api/schedule/datesummary
    [HttpGet("datesummary")]
    public async Task<IActionResult> GetDateSummary()
    {
        var summary = await _service.GetSummaryAsync();
        return Ok(summary);
    }
}