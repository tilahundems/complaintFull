using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.DTOs.Complaint;

public interface IComplaintService
{
    Task SubmitComplaintAsync(ComplaintDto complaintDto, int? userId);
    Task<IEnumerable<ComplaintDto>> GetAllComplaintsAsync(); // for users

    Task<IEnumerable<ComplaintDto>> GetComplaintsByUserIdAsync(int userId);
    Task UpdateComplaintStatusAsync(int id, ComplaintStatusUpdateDto dto);

}
