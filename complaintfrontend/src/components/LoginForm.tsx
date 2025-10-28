import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:51545/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password }),
        credentials: "include", // to include session cookie
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (response) {
             //  console.log(data.res.role)
                   const role = data.res.role;

             if (role === "Applicant1") {
        navigate("/solver");
        console.log(role)
      } else if (role === "Applicant") {
        navigate("/user");
        console.log(role)
      } else {
        setError("Access denied.");
      }
        throw new Error(data || "Login failed");
      }

      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("Email", Email);
      sessionStorage.setItem("userId", data.userId.toString());

        console.log(data.res.role)
      

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 w-full">
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-center">
          AbayBank Complaint System
        </h1>

        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-center">Login Form</h2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <Input
              type="text"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-4/5"
            />
            <Input
              type="Password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-4/5"
            />

            {error && (
              <div className="text-red-600 text-center font-medium">{error}</div>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-4/5 mt-4 text-black"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
