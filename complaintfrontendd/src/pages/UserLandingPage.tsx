import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UserLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-center">ABAY BANK COMPLAINT SYSTEM</h1>
      <p className="max-w-2xl text-center text-gray-700 mb-10 text-lg leading-relaxed">
        The complaint form allows users to report an issue by providing their personal details, such as their first name, last name, mobile number, branch, and district. After submission, the complaint is tracked and reviewed by our staff until it is resolved. This ensures all complaints are properly recorded and followed up.
      </p>

      <div className="flex gap-6">
        <Button onClick={() => navigate("/user/form")} className="text-black px-8 py-3 text-lg">
          Request Form
        </Button>
        <Button onClick={() => navigate("/user/status")} className="text-black px-8 py-3 text-lg">
          View Status
        </Button>
      </div>
    </div>
  );
}
