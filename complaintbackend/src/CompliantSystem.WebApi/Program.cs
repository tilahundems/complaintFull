using CompliantSystem.Application.Infrastructure;
using CompliantSystem.Infrastructure.Persistence;
using CompliantSystem.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Repositories
builder.Services.AddScoped<IComplaintService, ComplaintRepository>();
builder.Services.AddScoped<IBranchRepository, BranchRepository>();
builder.Services.AddScoped<IDistrictRepository, DistrictRepository>();
builder.Services.AddScoped<IComplaintSolverService, ComplaintSolverRepository>();

// Auth service
builder.Services.AddHttpClient<IAuthService, AuthService>();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod()
              ;
    });
});

// Sessions
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
 
// Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// OPTIONAL: disable HTTPS redirect in dev
// app.UseHttpsRedirection();

app.UseRouting();

// CORS
app.UseCors("AllowFrontend");

// Sessions
app.UseSession();

// Auth
app.UseAuthorization();

// Controllers
app.MapControllers();

// Run
app.Run();
