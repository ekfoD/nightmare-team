using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<Point_of_Sale_System.Server.Models.Data.PoSDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
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

//app.UseCors("AllowReact");

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();



// kas turi prieiga prie employees edit?

// ar employees gali keisti savo log in info? 





// hierarchines roles

// kai service based: menu -> services, inventory -> schedule
