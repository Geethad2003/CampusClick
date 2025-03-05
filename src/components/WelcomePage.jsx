import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import "./WelcomePage.css";

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
      </div>
    </div>
  );
};

export default WelcomePage;
