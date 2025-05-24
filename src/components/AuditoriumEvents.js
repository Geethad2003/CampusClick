import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AuditoriumEvents.css";

const AuditoriumEvents = () => {
  const { name } = useParams(); // Get auditorium name from URL
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // State to store events
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    // Fetch events for the selected auditorium
    axios
      .get(`http://localhost:3000/api/auditorium/bookings?auditorium=${name}`)
      .then((response) => {
        if (response.data.success) {
          setEvents(response.data.data); // Update events state
        } else {
          setError(response.data.message || `No events found for ${name}.`);
        }
        setLoading(false); // Stop loading indicator
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("Error fetching events. Please try again later.");
        setLoading(false); // Stop loading indicator
      });
  }, [name]);

  const handleEventClick = (event) => {
    // Navigate to the seat booking page for the selected event in the respective auditorium
    navigate(`/seat-booking/${name}/${event.event_id}`, { state: { event, auditorium: name } });
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-container">
      <h2>Events in {name} Auditorium</h2>
      {events.length === 0 ? (
        <p>No events found for {name}.</p>
      ) : (
        <ul className="event-list">
          {events.map((event, index) => (
            <li
              key={index}
              className="event-item"
              onClick={() => handleEventClick(event)}
            >
              <strong>📢 {event.event_name}</strong>
              <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
              <p>🕒 {event.start_time} - {event.end_time}</p>
              <p>👤 Booked by: {event.staff_email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuditoriumEvents;