using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.DTOs.Complaint;
using CompliantSystem.Application.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CompliantSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComplaintController : ControllerBase
{
    private readonly IComplaintService _complaintService;
    private readonly IBranchRepository _branchRepo;
    private readonly IDistrictRepository _districtRepo;

    public ComplaintController(IComplaintService complaintService, IBranchRepository branchRepo, IDistrictRepository districtRepo)
    {
        _complaintService = complaintService;
        _branchRepo = branchRepo;
        _districtRepo = districtRepo;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitComplaint([FromBody] ComplaintDto dto)
    {
        var userId = HttpContext.Session.GetInt32("UserId");

        if (userId == null)
        {
            return Unauthorized(new { success = false, message = "User not logged in or session expired." });
        }

        await _complaintService.SubmitComplaintAsync(dto, userId);
        return Ok(new { success = true });
    }


    [HttpGet("branches")]
    public async Task<IActionResult> GetBranches()
    {
        var branches = await _branchRepo.GetAllBranchesAsync();
        return Ok(branches);
    }

    [HttpGet("districts")]
    public async Task<IActionResult> GetDistricts()
    {
        var districts = await _districtRepo.GetAllDistrictsAsync();
        return Ok(districts);
    }

    [HttpGet("user-view")]
    public async Task<IActionResult> GetAllComplaintsForUser()
    {
        var complaints = await _complaintService.GetAllComplaintsAsync(); // No userId filter
        return Ok(complaints);
    }


}
