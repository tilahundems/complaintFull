using CompliantSystem.Application.Infrastructure;
using CompliantSystem.Domain.Entities;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace CompliantSystem.Infrastructure.Persistence;

public class DistrictRepository : IDistrictRepository
{
    private readonly string _connectionString;

    public DistrictRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    public async Task<IEnumerable<District>> GetAllDistrictsAsync()
    {
        using var connection = CreateConnection();
        return await connection.QueryAsync<District>("SELECT id, name FROM districts");
    }
}
