using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.DTOs.Complaint;
using CompliantSystem.Application.Infrastructure;
using CompliantSystem.Domain.Entities;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace CompliantSystem.Infrastructure.Persistence;

public class ComplaintSolverRepository : IComplaintSolverService
{
    private readonly string _connectionString;

    public ComplaintSolverRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    public async Task<IEnumerable<ComplaintDto>> GetAllComplaintsAsync()
    {
        using var connection = CreateConnection();

        var sql = @"
        SELECT 
        c.id,
        c.lodged_date AS LodgedDate,
        c.first_name AS FirstName,
        c.second_name AS SecondName,
        c.mobile_number AS MobileNumber,
        c.branch_id AS BranchId,
        b.name AS BranchName,
        c.district_id AS DistrictId,
        d.name AS DistrictName,
        c.issue_raised AS IssueRaised,
        c.status AS Status,
        c.status_update_date AS StatusUpdateDate,
        c.days_taken AS DaysTaken
        FROM complaints c
        LEFT JOIN branches b ON c.branch_id = b.id
        LEFT JOIN districts d ON c.district_id = d.id
        ORDER BY c.lodged_date DESC;
    ";

        var results = await connection.QueryAsync<ComplaintDto>(sql);
        return results;
    }



    public async Task UpdateComplaintStatusAsync(int id, ComplaintStatusUpdateDto dto)
    {
        using var connection = CreateConnection();

        // Calculate business days
        int daysTaken = CalculateBusinessDays(
            (await connection.QuerySingleAsync<Complaint>("SELECT lodged_date FROM complaints WHERE id = @Id", new { Id = id })).LodgedDate,
            dto.StatusUpdateDate
        );

        var sql = @"UPDATE complaints 
                    SET status = @Status, 
                        status_update_date = @StatusUpdateDate, 
                        days_taken = @DaysTaken 
                    WHERE id = @Id";

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            Status = dto.Status,
            StatusUpdateDate = dto.StatusUpdateDate,
            DaysTaken = daysTaken
        });
    }

    private int CalculateBusinessDays(DateTime start, DateTime end)
    {
        int businessDays = 0;
        for (var date = start.Date; date <= end.Date; date = date.AddDays(1))
        {
            if (date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday)
                businessDays++;
        }
        return businessDays;
    }


}
