using Point_of_Sale_System.Server.Models;


public interface IScheduleRepository
{
Task<IEnumerable<Schedule>> GetSchedulesByDateAsync(DateOnly date);
Task<Dictionary<DateOnly, int>> GetDateSummaryAsync();
}