using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.DTOs.Complaint;

namespace CompliantSystem.Application.Infrastructure;

public interface IComplaintSolverService
{
    Task<IEnumerable<ComplaintDto>> GetAllComplaintsAsync();
    Task UpdateComplaintStatusAsync(int id, ComplaintStatusUpdateDto dto);
}
