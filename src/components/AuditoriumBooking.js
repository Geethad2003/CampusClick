import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './AuditoriumBooking.css'; 
import { useNavigate } from "react-router-dom";

const AuditoriumBooking = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [existingBookings, setExistingBookings] = useState([]);
    const [report, setReport] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    const handleBackClick = () => {
        navigate(-1);
    };
    
    useEffect(() => {
        if (date) {
            axios.get(`http://localhost:3000/api/auditorium/bookings?auditorium=${name}&date=${date}`)
                .then(response => {
                    console.log(response.data.data);
                    setExistingBookings(response.data.data);
                })
                .catch(error => console.error("Error fetching bookings", error));
        }
    }, [date, name]);


    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        const startTimeValue = parseInt(newStartTime.replace(":", ""), 10);
        const endTimeValue = endTime ? parseInt(endTime.replace(":", ""), 10) : 0;
    
        if (startTimeValue <= 0) {
            alert("Start Time must be greater than zero.");
            return;
        }
    
        if (endTime && startTimeValue >= endTimeValue) {
            alert("Start Time should be earlier than End Time.");
            return;
        }
    
        setStartTime(newStartTime);
    };
    
    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        const startTimeValue = startTime ? parseInt(startTime.replace(":", ""), 10) : 0;
        const endTimeValue = parseInt(newEndTime.replace(":", ""), 10);
    
        if (!startTimeValue) {
            alert("Please set a valid Start Time before setting an End Time.");
            return;
        }
    
        if (startTimeValue >= endTimeValue) {
            alert("End Time must be lesser than Start Time.");
            return;
        }
    
        setEndTime(newEndTime);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/api/auditorium/book", {
            auditorium_name: name,
            event_name: eventName,
            event_date: date,
            start_time: startTime,
            end_time: endTime,
            staff_email: userEmail
        })
        .then(response => {
            {
                const confirmationId = response.data.confirmationId; // Ensure this is returned by your API
                const eventDetails = {
                    auditorium_name: name,
                    event_name: eventName,
                    event_date: date,
                    start_time: startTime,
                    end_time: endTime,
                    staff_email: userEmail
                };
                navigate("/eventConfirmation", { state: { confirmationId, eventDetails } });
            }
        })
        .catch(error => {
            console.error("Error booking auditorium:", error);
            alert(error.response.data.message);
        });
    };
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        if (!date || !name) {
            alert("Please select a date and auditorium");
            return;
        }

        axios.get(`http://localhost:3000/api/auditorium/report?auditoriumName=${name}&bookingDate=${date}`)
            .then(response => {
                if (response.data.success) {
                    setReport(response.data.report);
                    console.log("Booking Report:", response.data.report);
                    setOpen(true);
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching report:", error);
                alert("Error generating report.");
            });
    };

    const handleClose = () => setOpen(false);

    return (
        <div className="container">
            <button 
                onClick={handleBackClick} 
                style={{
                    position: "relative",
                    left: "10px",
                    top: "10px",
                }}
            >
                Back
            </button>
            <h2>Book {name} Auditorium</h2>
        
            <button onClick={handleOpen}>View Previously Selected Events (Select Event Date)</button>

            {open && (
                <div className="dialog-box">
                    <div className="dialog-content">
                        <h3>Booking Report:</h3>
                        <ul>
                            {report.length > 0 && report.map((booking, index) => (
                                <li key={index}>
                                    <strong>{booking.event_name}</strong> - {booking.start_time} to {booking.end_time}
                                    <br />
                                    Date: {booking.event_date}
                                    <br />
                                    Booked by: {booking.staff_email}
                                </li>
                            ))}
                            {report.length <= 0 && <li>No bookings found for this date.</li>}
                        </ul>
                        <button onClick={handleClose}>Close</button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>Event Name:</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />

                <label>Select Date:</label>
                <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} required />

                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={handleStartTimeChange} required />

                <label>End Time:</label>
                <input type="time" value={endTime} onChange={handleEndTimeChange} required />

                <button type="submit">Book</button>
            </form>
        </div>
    );
};

export default AuditoriumBooking;