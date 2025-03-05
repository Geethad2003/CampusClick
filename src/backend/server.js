const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./db"); // Using existing database connection
const auditoriumRoutes = require("./routes/auditoriumRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auditorium", auditoriumRoutes);

// 🔹 Register API (No Password Hashing)
app.post("/register", (req, res) => {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const table = role === "student" ? "students" : "staff";
    const query = `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?);`;

    db.query(query, [name, email, password], (err) => {
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
        const token = jwt.sign({ email: user.email, role: user.role }, "secretkey", { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful", token, user });
    });
});

// 🔹 Fetch All Booked Seats for an Auditorium
app.get("/get-booked-seats", (req, res) => {
    const { audi_name } = req.query;

    if (!audi_name) {
        return res.status(400).json({ success: false, message: "Auditorium name is required." });
    }

    const query = "SELECT seat_number FROM bookings WHERE audi_name = ?";
    db.query(query, [audi_name], (err, results) => {
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
    const { email, audi_name } = req.query;

    if (!email || !audi_name) {
        return res.status(400).json({ success: false, message: "Email and auditorium name are required." });
    }

    const query = "SELECT seat_number FROM bookings WHERE user_email = ? AND audi_name = ?";
    db.query(query, [email, audi_name], (err, results) => {
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

// 🔹 Seat Booking API
app.post("/book-seat", (req, res) => {
    const { user_email, seat_number, audi_name } = req.body;

    if (!user_email || !seat_number || !audi_name) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // Check if the user already booked a seat for this auditorium
    db.query("SELECT * FROM bookings WHERE user_email = ? AND audi_name = ?", [user_email, audi_name], (err, userResults) => {
        if (err) {
            console.error("Error checking user booking:", err);
            return res.status(500).json({ success: false, message: "Database error." });
        }

        if (userResults.length > 0) {
            return res.status(400).json({ success: false, message: "You have already booked a seat." });
        }

        // Check if the seat is already booked
        db.query("SELECT * FROM bookings WHERE seat_number = ? AND audi_name = ?", [seat_number, audi_name], (err, seatResults) => {
            if (err) {
                console.error("Error checking seat availability:", err);
                return res.status(500).json({ success: false, message: "Database error." });
            }

            if (seatResults.length > 0) {
                return res.status(400).json({ success: false, message: `Seat ${seat_number} is already booked for ${audi_name}.` });
            }

            // Book the seat
            db.query("INSERT INTO bookings (user_email, seat_number, audi_name) VALUES (?, ?, ?)", [user_email, seat_number, audi_name], (err) => {
                if (err) {
                    console.error("Error booking seat:", err);
                    return res.status(500).json({ success: false, message: "Database error." });
                }
                res.status(200).json({ success: true, message: `Seat ${seat_number} successfully booked for ${audi_name}` });
            });
        });
    });
});

// 🔹 Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
