using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CompliantSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SolverController : ControllerBase
{
    private readonly IComplaintSolverService _service;

    public SolverController(IComplaintSolverService service)
    {
        _service = service;
    }

    [HttpGet("complaints")]
    public async Task<IActionResult> GetAll()
    {
        var complaints = await _service.GetAllComplaintsAsync();
        return Ok(complaints);
    }

    [HttpPut("complaints/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ComplaintStatusUpdateDto dto)
    {
        await _service.UpdateComplaintStatusAsync(id, dto);
        return Ok(new { success = true });
    }
}
