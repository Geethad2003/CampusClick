import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMic, FiUsers, FiLogOut, FiUser } from "react-icons/fi";
import "./styles2.css";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      navigate("/"); // Redirect to login if no email found
    }
  }, [navigate]);

  const options = [
    { name: "SilverStone Auditorium", icon: <FiMic />, path: "/auditorium/silverstone" },
    { name: "SKE Auditorium", icon: <FiMic />, path: "/auditorium/ske" },
    { name: "Main Auditorium", icon: <FiMic />, path: "/auditorium/main" },
    { name: "Mini Auditorium", icon: <FiMic />, path: "/auditorium/mini" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/"); // Redirect back to Welcome Page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="dashboard-container">
        {/* Profile Card */}
        <div className="profile-card">
          <FiUser className="profile-icon" />
          <span className="profile-email">{userEmail}</span>
        </div>
        
        <h1 className="dashboard-title">Staff Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, manage the following auditoriums</p>

        <div className="grid-container">
          {options.map((option, index) => (
            <Link key={index} to={option.path} className="dashboard-card">
              <div className="dashboard-card-icon">{option.icon}</div>
              <span className="dashboard-card-text">{option.name}</span>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut className="inline-block mr-2 text-xl" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
