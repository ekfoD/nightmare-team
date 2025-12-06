private readonly List<Schedule> _schedules;

public MockScheduleRepository(IWebHostEnvironment env)
{
    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
        Converters =
        {
            new DateOnlyJsonConverter(),
            new TimeOnlyJsonConverter()
        }
    };

    var filePath = Path.Combine(env.ContentRootPath, "Data", "schedules.json");
    var json = File.ReadAllText(filePath);

    _schedules = JsonSerializer.Deserialize<List<Schedule>>(json, options)
                 ?? new List<Schedule>();
}