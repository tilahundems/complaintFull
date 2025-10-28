namespace CompliantSystem.Application.DTOs.Complaint
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public DateTime LodgedDate { get; set; }
        public string FirstName { get; set; } = default!;
        public string SecondName { get; set; } = default!;
        public string MobileNumber { get; set; } = default!;
        public int BranchId { get; set; }
        public string BranchName { get; set; } = default!;
        public int DistrictId { get; set; }
        public string DistrictName { get; set; } = default!;
        public string IssueRaised { get; set; } = default!;
        public string Status { get; set; } = default!;
        public DateTime? StatusUpdateDate { get; set; }
        public int? DaysTaken { get; set; }
    }
}