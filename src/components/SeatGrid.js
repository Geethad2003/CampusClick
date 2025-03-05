import React from "react";

const SeatGrid = ({ totalSeats, bookedSeats, userBookedSeat, onBook }) => {
  const halfSeats = Math.ceil(totalSeats / 2);
  const sections = {
    Left: Array.from({ length: halfSeats }, (_, i) => i + 1),
    Right: Array.from({ length: totalSeats - halfSeats }, (_, i) => halfSeats + i + 1),
  };

  return (
    <div className="seat-container">
      {Object.entries(sections).map(([section, seats]) => (
        <div key={section} className="seat-section">
          <h3 className="section-title">{section} Section</h3>
          <div className="seat-grid">
            {seats.map((seatNumber) => {
              const isBooked = bookedSeats.includes(seatNumber);
              const isUserSeat = seatNumber === userBookedSeat;
              return (
                <button
                  key={seatNumber}
                  disabled={isBooked || isUserSeat}
                  onClick={() => onBook(seatNumber)}
                  className={`seat-button ${isBooked ? "booked" : ""} ${isUserSeat ? "user-seat" : ""}`}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
