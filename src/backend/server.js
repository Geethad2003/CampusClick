const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const auditoriumRoutes = require("./routes/auditoriumRoutes");
const db = require("./db"); // Import the centralized database connection
const { CLOSING } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🔹 Auditorium Routes
app.use("/api/auditorium", auditoriumRoutes);

// 🔹 Register API (No Password Hashing)
app.post("/register", (req, res) => {
  const { role, name, email, password, position } = req.body;

  if (!role || !name || !email || !password || (role === "staff" && !position)) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const table = role === "student" ? "students" : "staff";
  const query =
    role === "student"
      ? `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?);`
      : `INSERT INTO ${table} (name, email, password, position) VALUES (?, ?, ?, ?);`;

  const values =
    role === "student" ? [name, email, password] : [name, email, password, position];

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
});

// 🔹 Login API (No Password Hashing)
app.post("/login", (req, res) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const table = role === "student" ? "students" : "staff";
  const query = `SELECT * FROM ${table} WHERE email = ? AND password = ?;`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    const user = results[0];

    // Generate JWT token
    const token = jwt.sign({ email: user.email, role: user.role }, "secretkey", {
      expiresIn: "1h",
    });

    res.json({ success: true, message: "Login successful", token, user });
  });
});

// 🔹 Fetch All Booked Seats for an Auditorium
app.get("/get-booked-seats", (req, res) => {
  const { audi_name, eventId } = req.query;

  if (!audi_name || !eventId) {
      return res.status(400).json({ success: false, message: "Auditorium name is required." });
  }

  const query = "SELECT seat_number FROM seat_bookings WHERE auditorium = ? AND event_id = ?";
  db.query(query, [audi_name, eventId], (err, results) => {
      if (err) {
          console.error("Error fetching booked seats:", err);
          return res.status(500).json({ success: false, message: "Database error." });
      }

      const bookedSeats = results.map((row) => row.seat_number);
      res.json({ success: true, bookedSeats });
  });
});

// 🔹 Fetch User's Booked Seat
app.get("/get-user-seat", (req, res) => {
  const { email, audi_name, eventId } = req.query;
  if (!email || !audi_name || !eventId) {
      return res.status(400).json({ success: false, message: "Email and auditorium name are required." });
  }

  const query = "SELECT seat_number FROM seat_bookings WHERE user_email = ? AND auditorium = ? AND event_id = ?";
  db.query(query, [email, audi_name, eventId], (err, results) => {
      if (err) {
          console.error("Error fetching user booking:", err);
          return res.status(500).json({ success: false, message: "Database error." });
      }

      if (results.length > 0) {
          res.json({ success: true, seat_number: results[0].seat_number });
      } else {
          res.json({ success: false, message: "No seat booked by user." });
      }
  });
});


// 🔹 API Endpoint to Book a Seat
app.post("/api/book-seat", (req, res) => {
  const { auditorium, eventId, seatNumber, userEmail } = req.body;

  if (!auditorium || !eventId || !seatNumber || !userEmail) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  // Check if the user has already booked a seat for this event
  const checkQuery = `
    SELECT * FROM seat_bookings 
    WHERE event_id = ? AND user_email = ?
  `;
  db.query(checkQuery, [eventId, userEmail], (err, results) => {
    if (err) {
      console.error("Error checking existing booking:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "You have already booked a seat for this event." });
    }

    // Book the seat
    const insertQuery = `
      INSERT INTO seat_bookings (auditorium, event_id, seat_number, user_email)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertQuery, [auditorium, eventId, seatNumber, userEmail], (err, result) => {
      if (err) {
        console.error("Error booking seat:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      res.json({ success: true, message: "Seat booked successfully." });
    });
  });
});

// 🔹 Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});