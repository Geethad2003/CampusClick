import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeatGrid from "./SeatGrid";

const auditoriumSeats = {
  "Silverstone Audi": 800,
  "SKE Audi": 500,
  "Main Audi": 300,
  "Mini Audi": 150,
};

const SeatBooking = () => {
  const { audiName } = useParams();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userBookedSeat, setUserBookedSeat] = useState(null);
  const totalSeats = auditoriumSeats[audiName] || 50;

  useEffect(() => {
    fetch(`http://localhost:5000/get-booked-seats?audi_name=${audiName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookedSeats(data.bookedSeats);
        }
      });

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(`http://localhost:5000/get-user-seat?email=${userEmail}&audi_name=${audiName}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserBookedSeat(data.seat_number);
          }
        });
    }
  }, [audiName]);

  const handleBooking = (seatNumber) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return alert("Login required to book a seat.");
    if (userBookedSeat) return alert("You have already booked a seat.");

    fetch("http://localhost:5000/book-seat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: userEmail, seat_number: seatNumber, audi_name: audiName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          setBookedSeats([...bookedSeats, seatNumber]);
          setUserBookedSeat(seatNumber);
        }
      });
  };

  return (
    <div className="seat-booking-container">
      <h2 className="text-2xl font-bold text-center">Book Seat in {audiName}</h2>
      <SeatGrid totalSeats={totalSeats} bookedSeats={bookedSeats} userBookedSeat={userBookedSeat} onBook={handleBooking} />
    </div>
  );
};

export default SeatBooking;
