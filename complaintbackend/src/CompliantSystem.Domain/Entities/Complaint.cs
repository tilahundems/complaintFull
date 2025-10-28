namespace CompliantSystem.Domain.Entities;

public class Complaint
{
    public int Id { get; set; }
    public DateTime LodgedDate { get; set; }
    public string FirstName { get; set; } = default!;
    public string SecondName { get; set; } = default!;
    public string MobileNumber { get; set; } = default!;
    public int BranchId { get; set; }
    public int DistrictId { get; set; }
    public string Branch { get; set; }  // <-- now string name, not int
    public string District { get; set; }
    public string IssueRaised { get; set; } = default!;
    public string Status { get; set; } = "On Track";
    public DateTime? StatusUpdateDate { get; set; }
    public int? DaysTaken { get; set; }
    public int? UserId { get; set; }
}
