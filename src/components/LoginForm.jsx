import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error("Server error. Try again later.");
      }

      if (data.success) {
        // Store login details in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);
        if (data.token) {
          localStorage.setItem("userToken", data.token); // Save JWT if returned
        }
        if (data.user && data.user.name) {
          localStorage.setItem("userName", data.user.name); // Save user name if available
        }

        // Redirect based on role
        navigate(`/${role}-dashboard`);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="error">{error}</p>}
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="student">Student</option>
        <option value="staff">Staff</option>
      </select>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
