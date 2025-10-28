using CompliantSystem.Application.Infrastructure;
using CompliantSystem.Domain.Entities;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace CompliantSystem.Infrastructure.Persistence;

public class BranchRepository : IBranchRepository
{
    private readonly string _connectionString;

    public BranchRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    public async Task<IEnumerable<Branch>> GetAllBranchesAsync()
    {
        using var connection = CreateConnection();
        return await connection.QueryAsync<Branch>("SELECT id, name FROM branches");
    }
}
