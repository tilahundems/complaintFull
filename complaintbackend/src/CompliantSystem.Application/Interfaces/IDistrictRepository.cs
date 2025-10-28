using CompliantSystem.Domain.Entities;

namespace CompliantSystem.Application.Infrastructure;

public interface IDistrictRepository
{
    Task<IEnumerable<District>> GetAllDistrictsAsync();
}