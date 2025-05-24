import React, { useState } from "react";

const SeatGrid = ({ totalSeats, bookedSeats, userBookedSeat, onBook }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const halfSeats = Math.ceil(totalSeats / 2);
  const sections = {
    Left: Array.from({ length: halfSeats }, (_, i) => i + 1),
    Right: Array.from({ length: totalSeats - halfSeats }, (_, i) => halfSeats + i + 1),
  };
  const handleBook = () => {
    if (selectedSeat && !bookedSeats.includes(selectedSeat) && selectedSeat !== userBookedSeat) {
      onBook(selectedSeat);
    }
  };

  const handleAlter = () => {
    alert("You have already booked a seat.");
  };

  return (
    <div>
      <button className="submit-button" onClick={handleBook}>Submit</button>
    <div className="seat-container">
      {Object.entries(sections).map(([section, seats]) => (
        <div key={section} className="seat-section">
          <h3 className="section-title">{section} Section</h3>
          <div className="seat-grid">
            {seats.map((seatNumber) => {
              const isBooked = bookedSeats.includes(seatNumber);
              const isUserSeat = userBookedSeat === seatNumber;
              const isUserSelectedSeat = selectedSeat === seatNumber;

              return (
                <button
                  key={seatNumber}
                  disabled={isBooked || isUserSeat}
                  onClick={() => userBookedSeat? handleAlter(): setSelectedSeat(seatNumber)}
                  className={`seat-button ${isUserSelectedSeat ? "user-seat" : ""} ${isUserSeat && isBooked ? "user-seat" : ""} ${isBooked && !isUserSeat ? "booked" : ""}`}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    <button className="submit-button" onClick={handleBook}>Submit</button>
    </div>
  );
};

export default SeatGrid;
