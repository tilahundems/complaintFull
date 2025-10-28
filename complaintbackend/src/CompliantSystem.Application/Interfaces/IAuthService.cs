using CompliantSystem.Application.DTOs.Login;

namespace CompliantSystem.Application.Infrastructure
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequest);
    }
}
