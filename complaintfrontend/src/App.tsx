import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";

import SolverPage from "./pages/SolverPage";
import UserLandingPage from "./pages/UserLandingPage";
import ComplaintFormPage from "./pages/ComplaintFormPage";
import ComplaintStatusPage from "./pages/ComplaintStatusPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/user" element={<UserLandingPage />} />
        <Route path="/user/form" element={<ComplaintFormPage />} />
        <Route path="/user/status" element={<ComplaintStatusPage />} />
        <Route path="/solver" element={<SolverPage />} />
      </Routes>
    </Router>
  );
}
