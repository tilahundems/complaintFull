using CompliantSystem.Application.DTOs.Login;
using CompliantSystem.Application.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CompliantSystem.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);

            if (result.Success)
            {
                // Save session id and role in session
                HttpContext.Session.SetInt32("UserId", result.UserId);
                HttpContext.Session.SetString("SessionId", result.SessionId);
                HttpContext.Session.SetString("Role", result.Role);

                return Ok(new
                {
                    success = true,
                    role = result.Role,
                    sessionId = result.SessionId,
                    userId = result.UserId
                });
            }

            return Unauthorized(new { success = false, error = result.ErrorMessage });
        }
    }
}
