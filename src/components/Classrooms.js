import React, { useState, useEffect } from "react";
import "./ClassroomSchedule.css";
import axios from "axios";

const floors = [1, 2, 3, 4, 5];
const classrooms = ["P101", "P102", "P103", "P104"];
const timeSlots = [
  { start: "09:00 AM", end: "09:50 AM" },
  { start: "10:00 AM", end: "10:50 AM" },
  { start: "11:00 AM", end: "11:50 AM" },
  { start: "12:00 PM", end: "12:50 PM" },
  { start: "01:40 PM", end: "02:30 PM" },
  { start: "02:40 PM", end: "03:30 PM" },
  { start: "03:40 PM", end: "04:30 PM" }
];

const Classrooms = () => {
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Fetch booked slots when classroom or date is selected
  useEffect(() => {
    if (selectedClassroom && selectedDate) {
      axios
        .get(`/api/bookings/classroom?room=${selectedClassroom}&date=${selectedDate}`)
        .then((response) => {
          setBookedSlots(response.data.bookedSlots);
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
        });
    }
  }, [selectedClassroom, selectedDate]);

  const handleClassroomClick = (room) => {
    setSelectedClassroom(room);
    setBookingStatus(null); // Reset booking status
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (selected >= today) {
      setSelectedDate(selected);
    } else {
      alert("Cannot select past dates.");
    }
  };

  const handleSlotBooking = (slot) => {
    if (bookedSlots.includes(slot.start)) {
      alert("This slot is already booked.");
      return;
    }

    axios
      .post("/api/bookings/book", {
        room: selectedClassroom,
        date: selectedDate,
        timeSlot: slot.start, // Ensure this matches backend
        userId: 1 // Replace with actual user ID
      })
      .then((response) => {
        setBookingStatus("Booking successful!");
        setBookedSlots([...bookedSlots, slot.start]);
      })
      //.catch((error) => {
        //console.error("Error booking slot:", error);
        //setBookingStatus("Booking failed.");
      //});
  };

  return (
    <div className="classroom-container">
      <h2>Select a Classroom</h2>
      <div className="floors">
        {floors.map((floor) => (
          <div key={floor} className="floor">
            <h3>Floor {floor}</h3>
            <div className="classroom-buttons">
              {classrooms.map((room) => (
                <button
                  key={`${floor}-${room}`}
                  onClick={() => handleClassroomClick(room)}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedClassroom && (
        <div className="schedule">
          <h3>Schedule for {selectedClassroom}</h3>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          {selectedDate && (
            <div className="slots">
              {timeSlots.map((slot, index) => {
                const isBooked = bookedSlots.includes(slot.start);
                return (
                  <div
                    key={index}
                    className={`slot ${isBooked ? "booked" : ""}`}
                    onClick={!isBooked ? () => handleSlotBooking(slot) : null}
                  >
                    {slot.start} - {slot.end}
                    {isBooked && <span className="booked-label">Booked</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {bookingStatus && <p>{bookingStatus}</p>}
    </div>
  );
};

export default Classrooms;
