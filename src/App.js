import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

// Import Components
import WelcomePage from "./components/WelcomePage";
import LoginForm from "./components/LoginForm";
import StudentDashboard from "./components/StudentDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AuditoriumBooking from "./components/AuditoriumBooking";
import AuditoriumEvents from "./components/AuditoriumEvents";
import SeatBooking from "./components/SeatBooking";
import FeedbackPage from "./components/FeedbackPage";

// Import Styles
import "./components/LoginForm.css";
import "./components/WelcomePage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import EventConfirmation from "./components/EventConfirmation";
import { EventList } from "./components/EventList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if user is logged in
  const checkAuthStatus = useCallback(() => {
    console.log("Checking authentication status...");
    const userEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(!!userEmail);
  }, []);

  useEffect(() => {
    console.log("useEffect running...");
    checkAuthStatus();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          {/* Protected Routes */}
          {/* Dashboard Routes */}
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
            path="/auditorium/:name"
            element={isAuthenticated ? <AuditoriumBooking /> : <Navigate to="/" />}
          />

          <Route 
          path="/eventConfirmation" 
          element={isAuthenticated ? <EventConfirmation /> : <Navigate to="/" />} />
          
          <Route
            path="/auditorium-events/:name"
            element={isAuthenticated ? <AuditoriumEvents /> : <Navigate to="/" />}
          />

          {/* Seat Booking Routes - both versions combined */}
          <Route
            path="/seat-booking/:event_id"
            element={isAuthenticated ? <SeatBooking /> : <Navigate to="/" />}
          />
          <Route
            path="/seat-booking/:name/:eventId"
            element={isAuthenticated ? <SeatBooking /> : <Navigate to="/" />}
          />
          <Route 
            path="/allevents" 
            element={isAuthenticated ? <EventList /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;