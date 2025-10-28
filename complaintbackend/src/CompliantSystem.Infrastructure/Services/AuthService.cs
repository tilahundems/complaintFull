using CompliantSystem.Application.DTOs.Login;
using CompliantSystem.Application.Infrastructure;
using System.Net.Http.Json;
using System.Text.Json;

namespace CompliantSystem.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequest)
        {
            var loginUrl = "http://10.1.10.80/AbayERP/Webservices/wslogin";

            var response = await _httpClient.PostAsJsonAsync(loginUrl, loginRequest);
            if (!response.IsSuccessStatusCode)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    ErrorMessage = "External API error"
                };
            }

            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.TryGetProperty("message", out var messageProp) && messageProp.GetString() == "SUCCESS")
            {
                var group = root.GetProperty("Group");
                bool hasBOAdmin = group.TryGetProperty("BOAdmin", out var boAdmin) && boAdmin.GetArrayLength() > 0;
                bool hasEmployee = group.TryGetProperty("Employee", out var employee) && employee.GetArrayLength() > 0;

                string role = "User"; // default
                if (hasBOAdmin)
                    role = "Solver";
                else if (hasEmployee)
                    role = "User";

                // **Extract userid as int**
                int userId = 0;
                if (root.TryGetProperty("userid", out var userIdProp))
                {
                    var userIdStr = userIdProp.GetString();
                    if (!int.TryParse(userIdStr, out userId))
                    {
                        return new LoginResponseDto
                        {
                            Success = false,
                            ErrorMessage = "UserId format invalid"
                        };
                    }
                }
                else
                {
                    // fallback or error handling if userid not found
                    return new LoginResponseDto
                    {
                        Success = false,
                        ErrorMessage = "UserId missing in response"
                    };
                }

                // Generate a session id (just a guid for demo)
                string sessionId = Guid.NewGuid().ToString();

                return new LoginResponseDto
                {
                    Success = true,
                    Role = role,
                    SessionId = sessionId,
                    UserId = userId  // <-- set userId here!
                };
            }
            else
            {
                return new LoginResponseDto
                {
                    Success = false,
                    ErrorMessage = "Invalid username or password"
                };
            }
        }

    }
}
