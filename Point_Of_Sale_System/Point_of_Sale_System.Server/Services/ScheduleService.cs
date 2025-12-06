using Point_of_Sale_System.Server.Models;


public class ScheduleService
{
    private readonly IScheduleRepository _repo;
    public ScheduleService(IScheduleRepository repo)
    {
        _repo = repo;
    }


    public Task<IEnumerable<Schedule>> GetDailyAsync(DateOnly date)
        => _repo.GetSchedulesByDateAsync(date);


    public Task<Dictionary<DateOnly, int>> GetSummaryAsync()
        => _repo.GetDateSummaryAsync();

    
}