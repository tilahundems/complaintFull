namespace CompliantSystem.Application.DTOs.Login
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Role { get; set; } = default!;
        public string SessionId { get; set; } = default!;
        public int UserId { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
