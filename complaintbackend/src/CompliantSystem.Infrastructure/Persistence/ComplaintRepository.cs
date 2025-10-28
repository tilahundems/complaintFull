using CompliantSystem.Application.DTOs;
using CompliantSystem.Application.DTOs.Complaint;
using CompliantSystem.Domain.Entities;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace CompliantSystem.Infrastructure.Persistence;

public class ComplaintRepository : IComplaintService
{
    private readonly string _connectionString;

    public ComplaintRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    public async Task SubmitComplaintAsync(ComplaintDto complaintDto, int? userId)
    {
        using var connection = CreateConnection();

        var sql = @"INSERT INTO complaints 
            (lodged_date, first_name, second_name, mobile_number, branch_id, district_id, issue_raised, status, user_id) 
            VALUES (@LodgedDate, @FirstName, @SecondName, @MobileNumber, @BranchId, @DistrictId, @IssueRaised, @Status, @UserId)";

        var complaint = new Complaint
        {
            LodgedDate = DateTime.UtcNow,
            FirstName = complaintDto.FirstName,
            SecondName = complaintDto.SecondName,
            MobileNumber = complaintDto.MobileNumber,
            BranchId = complaintDto.BranchId,
            DistrictId = complaintDto.DistrictId,
            IssueRaised = complaintDto.IssueRaised,
            Status = "On Track",
            UserId = userId
        };

        await connection.ExecuteAsync(sql, complaint);
    }

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

        var complaints = await connection.QueryAsync<ComplaintDto>(sql);
        return complaints;
    }




    public async Task UpdateComplaintStatusAsync(int id, ComplaintStatusUpdateDto dto)
    {
        using var connection = CreateConnection();

        var getDateSql = "SELECT lodged_date FROM complaints WHERE id = @Id";
        var complaint = await connection.QuerySingleAsync<Complaint>(getDateSql, new { Id = id });

        int daysTaken = CalculateBusinessDays(complaint.LodgedDate, dto.StatusUpdateDate);

        var updateSql = @"UPDATE complaints 
                          SET status = @Status, 
                              status_update_date = @StatusUpdateDate, 
                              days_taken = @DaysTaken 
                          WHERE id = @Id";

        await connection.ExecuteAsync(updateSql, new
        {
            Id = id,
            Status = dto.Status,
            StatusUpdateDate = dto.StatusUpdateDate,
            DaysTaken = daysTaken
        });
    }

    public async Task<IEnumerable<ComplaintDto>> GetComplaintsByUserIdAsync(int userId)
    {
        var sql = @"SELECT id, lodged_date, first_name, second_name, mobile_number,
                           branch_id, district_id, issue_raised, status, 
                           status_update_date, days_taken
                    FROM complaints
                    WHERE user_id = @UserId
                    ORDER BY lodged_date DESC";

        using var connection = CreateConnection();
        var complaints = await connection.QueryAsync<ComplaintDto>(sql, new { UserId = userId });
        return complaints;
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
