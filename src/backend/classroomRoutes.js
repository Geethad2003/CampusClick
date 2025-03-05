const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Import the database connection pool

const router = express.Router();
const SECRET_KEY = "secretkey";

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token." });
    req.user = user;
    next();
  });
};

// 🔹 Get All Classrooms by Floor
router.get("/classrooms/:floor", authenticateToken, (req, res) => {
  const floor = req.params.floor;
  const query = "SELECT * FROM classrooms WHERE floor = ?";
  db.query(query, [floor], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error." });
    res.json({ success: true, classrooms: results });
  });
});

// 🔹 Fetch Booked Slots for a Classroom
router.get("/classroom-bookings", authenticateToken, (req, res) => {
  const { room, date } = req.query;
  if (!room || !date) return res.status(400).json({ success: false, message: "Room and date are required." });

  const query = "SELECT start_time FROM class_reservations WHERE classroom_id = (SELECT id FROM classrooms WHERE name = ?) AND date = ?";
  db.query(query, [room, date], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error." });
    res.json({ success: true, bookedSlots: results.map(row => row.start_time) });
  });
});

// 🔹 Book a Classroom (Create a reservation)
router.post("/book-classroom", authenticateToken, (req, res) => {
  const { classroomId, date, startTime, endTime, bookedBy } = req.body;
  if (!classroomId || !date || !startTime || !endTime || !bookedBy) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const query = `
    INSERT INTO class_reservations (classroom_id, date, start_time, end_time, booked_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [classroomId, date, startTime, endTime, bookedBy], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ success: false, message: "This time slot is already booked." });
      }
      return res.status(500).json({ success: false, message: "Database error." });
    }
    res.json({ success: true, message: "Classroom successfully booked!" });
  });
});

module.exports = router;
