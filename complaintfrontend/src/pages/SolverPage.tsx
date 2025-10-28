import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
//const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type Complaint = {
  id: string;
  lodgedDate: string;
  firstName: string;
  secondName: string;
  mobileNumber: string;
  branchId: number;
  branchName: string;
  districtId: number;
  districtName: string;
  issueRaised: string;
  status: string;
  statusUpdateDate: string;
  daysTaken: number;
};

const statusOptions = ["Resolved", "Taken to Court", "Referred to NBE"];
const filterOptions = ["All", "On Track", ...statusOptions];

export default function SolverPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://10.1.85.10:5000/api/Solver/complaints");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      // Sort by LodgedDate descending (newest first)
      const sortedData = data.sort((a: Complaint, b: Complaint) => new Date(b.lodgedDate).getTime() - new Date(a.lodgedDate).getTime());
      setComplaints(sortedData);
      applyFilter(sortedData, filter);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const applyFilter = (complaintsList: Complaint[], filterValue: string) => {
    if (filterValue === "All") {
      setFilteredComplaints(complaintsList);
    } else {
      setFilteredComplaints(complaintsList.filter((c) => c.status === filterValue));
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    applyFilter(complaints, value);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
  try {
    const payload = {
      status: newStatus,
      statusUpdateDate: new Date().toISOString(),
    };

    const res = await fetch(`http://10.1.85.10:8200/api/Solver/complaints/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update status");
    alert("Status updated");
    fetchComplaints(); // Refresh and reapply filter
  } catch (err) {
    alert(err instanceof Error ? err.message : String(err));
  }
};


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={fetchComplaints}>Refresh</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <p className="text-gray-600">No complaints available for this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Branch</th>
                <th className="p-2 border">District</th>
                <th className="p-2 border">Issue</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2 border">{new Date(c.lodgedDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{c.firstName} {c.secondName}</td>
                  <td className="p-2 border">{c.branchName}</td>
                  <td className="p-2 border">{c.districtName}</td>
                  <td className="p-2 border">{c.issueRaised}</td>
                  <td className="p-2 border">{c.status}</td>
                  <td className="p-2 border">
                    <Select onValueChange={(value) => handleStatusChange(c.id, value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}                             