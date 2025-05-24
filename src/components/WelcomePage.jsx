import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm"; // Assuming LoginForm is a separate component
import "./WelcomePage.css"; // Your CSS file for this page

const WelcomePage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "student") {
      navigate("/student-dashboard");
    } else if (userRole === "staff") {
      navigate("/staff-dashboard");
    }
  }, [navigate]);

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1 className="welcome-title">Welcome to CampusClick</h1>
        <LoginForm />

        {/* Contact Details Box */}
        <div className="contact-box">
          <h3 className="contact-title">Need Help? Contact Us</h3>
          <p className="contact-info">
            Email: <a href="mailto:support@campusclick.com">support@campusclick.com</a>
          </p>
          <p className="contact-info">
            Phone: <a href="tel:+911234567890">+91 12345 67890</a>
          </p>
          <p className="contact-info">
            Address: Kristu Jayanti College, Bengaluru, India
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
