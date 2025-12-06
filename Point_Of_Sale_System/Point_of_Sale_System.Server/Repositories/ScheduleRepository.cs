// using System.Text.Json;
// using Point_of_Sale_System.Server.Models;

// public class MockScheduleRepository
// {
//     private readonly List<Schedule> _schedules;

//     public MockScheduleRepository()
//     {
//         var options = new JsonSerializerOptions
//         {
//             PropertyNameCaseInsensitive = true,
//             Converters =
//             {
//                 new DateOnlyJsonConverter(),
//                 new TimeOnlyJsonConverter()
//             }
//         };

//         var json = File.ReadAllText("Data/schedules.json");
//         _schedules = JsonSerializer.Deserialize<List<Schedule>>(json, options) ?? new List<Schedule>();
//     }

//     public Task<IEnumerable<Schedule>> GetSchedulesByDateAsync(DateOnly date)
//     {
//         var result = _schedules.Where(s => s.Date == date);
//         return Task.FromResult(result);
//     }

//     public Task<IEnumerable<DateOnly>> GetSummaryAsync()
//     {
//         var dates = _schedules.Select(s => s.Date).Distinct();
//         return Task.FromResult(dates);
//     }
// }
