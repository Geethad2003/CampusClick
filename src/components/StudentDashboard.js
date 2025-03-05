import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiLogOut, FiUser } from "react-icons/fi"; // Added new icons

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  // Check if the user is logged in, else redirect to Welcome Page
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/"); // Redirect to Welcome Page
    } else {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/"); // Redirect to Welcome Page
  };

  const audiOptions = [
    { name: "Silverstone Audi", icon: <FiMic />, path: "/book-seat/Silverstone Audi" },
    { name: "SKE Audi", icon: <FiMic />, path: "/book-seat/SKE Audi" },
    { name: "Main Audi", icon: <FiMic />, path: "/book-seat/Main Audi" },
    { name: "Mini Audi", icon: <FiMic />, path: "/book-seat/Mini Audi" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <FiUser className="user-icon" />
          <span>{userEmail}</span>
        </div>
      </header>

      {/* Auditorium Options */}
      <div className="grid-container">
        {audiOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => navigate(option.path)}
            className="audi-card"
          >
            <div className="icon">{option.icon}</div>
            <span className="audi-name">{option.name}</span>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        <FiLogOut className="logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
