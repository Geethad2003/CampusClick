const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming your MySQL connection is in db.js

// Endpoint to fetch existing bookings for a specific auditorium and date
router.get("/bookings", (req, res) => {
    const { auditorium, date } = req.query;

    if (!auditorium || !date) {
        return res.status(400).json({ message: "Auditorium and date are required" });
    }

    const query = "SELECT start_time, end_time FROM auditorium_bookings WHERE auditorium_name = ? AND event_date = ?";
    db.query(query, [auditorium, date], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});

// Endpoint to book an auditorium
router.post("/book", (req, res) => {
    const { auditorium, eventName, date, startTime, endTime, staffEmail } = req.body;

    if (!auditorium || !eventName || !date || !startTime || !endTime || !staffEmail) {
        return res.status(400).json({ message: "All fields are required" });
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
    db.query(checkQuery, [auditorium, date, endTime, startTime, startTime, endTime, startTime, endTime], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length > 0) {
            return res.status(400).json({ message: "Time slot already booked" });
        }

        // Insert booking
        const insertQuery = `
            INSERT INTO auditorium_bookings (auditorium_name, event_name, event_date, start_time, end_time, staff_email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [auditorium, eventName, date, startTime, endTime, staffEmail], (err, result) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            res.status(201).json({ message: "Booking successful" });
        });
    });
});

// Endpoint to generate the booking report for a specific auditorium and date
router.get("/get-booking-report", (req, res) => {
    const { auditoriumName, bookingDate } = req.query;

    if (!auditoriumName || !bookingDate) {
        return res.status(400).json({ message: "Auditorium name and booking date are required" });
    }

    const reportQuery = `
        SELECT event_name, auditorium_name, staff_email AS booked_by, event_date AS booking_date, start_time, end_time
        FROM auditorium_bookings
        WHERE auditorium_name = ? AND event_date = ?
    `;

    db.query(reportQuery, [auditoriumName, bookingDate], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch the report.", error: err });
        }

        res.json({ success: true, report: results });
    });
});

module.exports = router;
