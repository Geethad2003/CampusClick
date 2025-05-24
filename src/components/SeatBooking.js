import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SeatGrid from "./SeatGrid"; 
import axios from "axios";

const SeatBooking = () => {
  const navigate = useNavigate();
  const auditoriumSeats = {
    "Silverstone": 800,
    "SKE": 500,
    "Main": 300,
    "Mini": 150,
  };
  const { name, eventId } = useParams(); // Get auditorium name and event ID from URL
  const location = useLocation();
  const event = location.state?.event; // Access the event details passed via state
  const totalSeats = auditoriumSeats[name] || 50; // Total number of seats in the auditorium
  const [bookedSeats, setBookedSeats] = useState([]); // State for booked seats
  const [userBookedSeat, setUserBookedSeat] = useState(null); // State for the user's booked seat
  const [bookingMessage, setBookingMessage] = useState(""); // State for booking confirmation
  const [newlyBookedSeat, setNewlyBookedSeat] = useState(null); // State for newly booked seat notification

  useEffect(() => {
    // Fetch initial booked seats
    fetch(`http://localhost:3000/get-booked-seats?audi_name=${name}&eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookedSeats(data.bookedSeats);
        }
      });

    // Fetch user's booked seat
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(`http://localhost:3000/get-user-seat?email=${userEmail}&audi_name=${name}&eventId=${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserBookedSeat(data.seat_number);
          }
        });
    }

    // Poll for updates to booked seats every 5 seconds
    const intervalId = setInterval(() => {
      fetch(`http://localhost:3000/get-booked-seats?audi_name=${name}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const newSeats = data.bookedSeats.filter(seat => !bookedSeats.includes(seat));
            if (newSeats.length > 0) {
              setNewlyBookedSeat(newSeats[0]); // Notify about the first newly booked seat
            }
            setBookedSeats(data.bookedSeats);
          }
        });
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [name]);

  const handleBookSeat = async (seatNumber) => {
    const userEmail = localStorage.getItem("userEmail");
    if (userBookedSeat) {
      alert("You have already booked a seat.");
      return;
    }

    if (bookedSeats.includes(seatNumber)) {
      alert("This seat is already booked.");
      return;
    }

    try {
      // Send booking details to the backend
      const response = await axios.post("http://localhost:3000/api/book-seat", {
        auditorium: name,
        eventId: eventId,
        seatNumber: seatNumber,
        userEmail: userEmail,
      });

      if (response.data.success) {
        setBookedSeats((prev) => [...prev, seatNumber]);
        setUserBookedSeat(seatNumber);
        // setBookingMessage(`Seat ${seatNumber} booked successfully!`);
        alert(`Seat ${seatNumber} booked successfully!`);
        navigate("/student-dashboard");

      } else {
        alert(response.data.message || "Failed to book the seat.");
      }
    } catch (error) {
      console.error("Error booking seat:", error.response || error.message);
      alert("Error booking the seat. Please try again later.");
    }
  };

  return (
    <div className="seat-booking-container">
      <h2>Seat Booking for {name} Auditorium</h2>
      <div className="event-details">
        <h3>Event Details</h3>
        <p><strong>Event Name:</strong> {event?.event_name}</p>
        <p><strong>Event Date:</strong> {new Date(event?.event_date).toLocaleDateString()}</p>
        <p><strong>Start Time:</strong> {event?.start_time}</p>
        <p><strong>End Time:</strong> {event?.end_time}</p>
        <p><strong>Booked By:</strong> {event?.staff_email}</p>
      </div>
      <div className="seat-grid-container">
        <h3>Select Your Seat</h3>
        <SeatGrid
          totalSeats={totalSeats}
          bookedSeats={bookedSeats}
          userBookedSeat={userBookedSeat}
          onBook={handleBookSeat}
        />
      </div>
      {/* {bookingMessage && <div className="booking-message">{bookingMessage}</div>}
      {newlyBookedSeat && (
        <div className="newly-booked-seat-notification">
          Seat {newlyBookedSeat} has just been booked!
        </div>
      )} */}
    </div>
  );
};

export default SeatBooking;