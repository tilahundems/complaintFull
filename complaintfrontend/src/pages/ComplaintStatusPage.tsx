import { useEffect, useState } from "react";

//const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type StatusType = "On Track" | "Resolved" | "Taken to Court" | "Referred to NBE";

type Complaint = {
  id: string;
  lodgedDate: string;
  firstName: string;
  secondName: string;
  mobileNumber: string;
  branchName: string;
  districtName: string;
  issueRaised: string;
  status: StatusType;
  statusUpdateDate: string;
  daysTaken: number;
};

const statusColorClasses: Record<StatusType, string> = {
  "On Track": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  "Taken to Court": "bg-red-100 text-red-800",
  "Referred to NBE": "bg-yellow-100 text-yellow-800",
};

export default function ComplaintStatusPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://10.1.85.10:8200/api/Complaint/user-view");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Complaints Status</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : complaints.length === 0 ? (
        <p className="text-gray-600 text-center">No complaints found.</p>
      ) : (
        <div className="overflow-x-auto max-w-6xl mx-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Branch</th>
                <th className="p-2 border">District</th>
                <th className="p-2 border">Issue</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2 border">{new Date(c.lodgedDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{c.firstName} {c.secondName}</td>
                  <td className="p-2 border">{c.branchName}</td>
                  <td className="p-2 border">{c.districtName}</td>
                  <td className="p-2 border">{c.issueRaised}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorClasses[c.status]}`}>
                      {c.status}
                    </span>
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
