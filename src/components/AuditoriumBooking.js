import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './AuditoriumBooking.css'; // Import the CSS file

const AuditoriumBooking = () => {
    const { name } = useParams();
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [existingBookings, setExistingBookings] = useState([]);
    const [report, setReport] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (date) {
            axios.get(`http://localhost:5000/api/auditorium/bookings?auditorium=${name}&date=${date}`)
                .then(response => setExistingBookings(response.data))
                .catch(error => console.error("Error fetching bookings", error));
        }
    }, [date, name]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/api/auditorium/book", {
            auditorium: name,
            eventName,
            date,
            startTime,
            endTime,
            staffEmail: userEmail
        })
        .then(response => alert(response.data.message))
        .catch(error => alert(error.response.data.message));
    };

    const handleNext = () => {
        if (!date || !name) {
            alert("Please select a date and auditorium");
            return;
        }

        axios.get(`http://localhost:5000/api/auditorium/report?auditoriumName=${name}&bookingDate=${date}`)
            .then(response => {
                if (response.data.success) {
                    setReport(response.data.report);
                    console.log("Booking Report:", response.data.report);
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching report:", error);
                alert("Error generating report.");
            });
    };

    return (
        <div className="container">
            <h2>Book {name} Auditorium</h2>
            <form onSubmit={handleSubmit}>
                <label>Event Name:</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />

                <label>Select Date:</label>
                <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} required />

                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

                <label>End Time:</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

                <button type="submit">Book</button>
            </form>

            <h3>Existing Bookings on {date}:</h3>
            <ul>
                {existingBookings.map((booking, index) => (
                    <li key={index}>{booking.start_time} - {booking.end_time}</li>
                ))}
            </ul>

            <button onClick={handleNext}>Next (Generate Report)</button>

            {report && (
                <div>
                    <h3>Booking Report:</h3>
                    <ul>
                        {report.map((booking, index) => (
                            <li key={index}>
                                <strong>{booking.event_name}</strong> - {booking.start_time} to {booking.end_time}
                                <br />
                                Booked by: {booking.booked_by}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AuditoriumBooking;
