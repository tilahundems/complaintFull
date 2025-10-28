using CompliantSystem.Domain.Entities;

namespace CompliantSystem.Application.Infrastructure;

public interface IBranchRepository
{
    Task<IEnumerable<Branch>> GetAllBranchesAsync();
}