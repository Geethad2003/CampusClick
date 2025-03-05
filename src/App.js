import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Import Components
import WelcomePage from "./components/WelcomePage";
import LoginForm from "./components/LoginForm";
import StudentDashboard from "./components/StudentDashboard";
import StaffDashboard from "./components/StaffDashboard";
import SeatBooking from "./components/SeatBooking";
import Auditorium from "./components/Auditorium";
import AuditoriumBooking from "./components/AuditoriumBooking";

import "./components/styles.css";
import "./components/LoginForm.css";
import "./components/WelcomePage.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(!!userEmail);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Welcome and Login Pages */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Student and Staff Dashboards with Protected Routes */}
          <Route
            path="/student-dashboard"
            element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/staff-dashboard"
            element={isAuthenticated ? <StaffDashboard /> : <Navigate to="/" />}
          />

          {/* Auditorium Routes */}
          <Route
            path="/auditorium"
            element={isAuthenticated ? <Auditorium /> : <Navigate to="/" />}
          />
          <Route
            path="/auditorium/:name"
            element={isAuthenticated ? <AuditoriumBooking /> : <Navigate to="/" />}
          />

          {/* Seat Booking Route with Dynamic Auditorium Name */}
          <Route
            path="/book-seat/:audiName"
            element={isAuthenticated ? <SeatBooking totalSeats={50} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
