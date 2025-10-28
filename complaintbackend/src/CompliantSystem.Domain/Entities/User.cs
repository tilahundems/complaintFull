namespace CompliantSystem.Domain.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = default!;
        public string Role { get; set; } = default!; // "User" or "Solver"
        public string SessionId { get; set; } = default!;
    }
}
