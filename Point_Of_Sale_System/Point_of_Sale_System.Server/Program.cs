using System.Drawing;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Repositories;
using Point_of_Sale_System.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IMenuServiceRepository, MenuServiceRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IOrganizationRepository, OrganizationRepository>();

builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IServicesService, ServicesService>();

// DB STUFF SHOULD BE HERE
// var connectionString =
//     builder.Configuration.GetConnectionString("DefaultConnection")
//         ?? throw new InvalidOperationException("Connection string"
//         + "'DefaultConnection' not found.");

// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // when prod phase, domain can be added
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowReact");

app.MapControllers();

app.MapFallbackToFile("/index.html");

FakeDataSeeder.Seed();

app.Run();



// kas turi prieiga prie employees edit?

// ar employees gali keisti savo log in info? 





// hierarchines roles

// kai service based: menu -> services, inventory -> schedule