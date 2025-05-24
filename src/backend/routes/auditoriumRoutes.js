const express = require("express");
const db = require("../db");
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// API to book an auditorium
router.post("/book", (req, res) => {
    const { auditorium_name, event_name, event_date, start_time, end_time, staff_email } = req.body;

    if (!auditorium_name || !event_name || !event_date || !start_time || !end_time || !staff_email) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

      // Check for overlapping bookings
      const checkQuery = `
      SELECT * FROM auditorium_bookings 
      WHERE auditorium_name = ? 
      AND event_date = ? 
      AND (
          (start_time < ? AND end_time > ?) OR 
          (start_time < ? AND end_time > ?) OR 
          (start_time >= ? AND end_time <= ?)
      )
  `;
  
  db.query(checkQuery, [auditorium_name, event_date, start_time, start_time, end_time, end_time, start_time, end_time], (err, results) => {    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length > 0) {
        return res.status(400).json({ message: "Time slot already booked" });
    }

    // Insert booking
    const event_id = uuidv4(); // Generate a unique event ID
    const query = `INSERT INTO auditorium_bookings (auditorium_name, event_name, event_date, start_time, end_time, staff_email, event_id) VALUES (?, ?, ?, ?, ?, ?, ?);`;

    db.query(query, [auditorium_name, event_name, event_date, start_time, end_time, staff_email, event_id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error.", error: err.message });
        }
        res.json({ success: true, message: "Auditorium booked successfully!" });
    });
    
})
});

// API to get bookings for a specific auditorium
router.get("/bookings", (req, res) => {
    const { auditorium } = req.query;

    if (!auditorium) {
        return res.status(400).json({ success: false, message: "Auditorium is required!" });
    }

    const query = `SELECT * FROM auditorium_bookings WHERE auditorium_name = ?`;

    db.query(query, [auditorium], (err, results) => {
    if (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ success: false, message: "Database error.", error: err.message });
    }
    console.log("Bookings fetched:", results); 
    res.json({ success: true, data: results });
});
});

// API to generate a report for a specific auditorium and date
router.get("/report", (req, res) => {
    const { auditoriumName, bookingDate } = req.query;

    if (!auditoriumName || !bookingDate) {
        return res.status(400).json({ success: false, message: "Auditorium name and booking date are required!" });
    }

    const query = `SELECT * FROM auditorium_bookings WHERE auditorium_name = ? AND event_date = ?;`;

    db.query(query, [auditoriumName, bookingDate], (err, results) => {
        if (err) {
            console.error("Error generating report:", err);
            return res.status(500).json({ success: false, message: "Database error.", error: err.message });
        }
        res.json({ success: true, report: results });
    });
});

// API to get all events
router.get('/allevents', (req, res) => {
    const query = 'SELECT * FROM auditorium_bookings';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


module.exports = router;