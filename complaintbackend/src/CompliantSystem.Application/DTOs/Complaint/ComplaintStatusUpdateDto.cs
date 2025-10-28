namespace CompliantSystem.Application.DTOs;

public class ComplaintStatusUpdateDto
{
    public string Status { get; set; } = default!;
    public DateTime StatusUpdateDate { get; set; } = DateTime.UtcNow;
}
