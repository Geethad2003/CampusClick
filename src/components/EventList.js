import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component for listing all events
const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const eventsPerPage = 10; // Default number of events per page

  // Calculate pagination details
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
      setCurrentPage(page);
  };
  const handleBackClick = () => {
    navigate("/staff-dashboard");
};
  // Fetch events from the API
  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auditorium/allevents");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events.");
        }

        setEvents(data); // Update state with the list of events
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(37, 156, 225, 0.1)",
        maxWidth: "800px",
        margin: "20px auto",
    }}>
        <button 
                onClick={handleBackClick} 
                style={{
                    position: "relative",
                    left: "10px",
                    top: "10px",
                    borderRadius: "8px",
                    padding: "8px 16px", 
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #4f46e5, #6b21a8)",
                    fontFamily: "Tahoma",
                    color: "white"
                }}
            >
                Back
            </button>
        <h1 style={{
            background: "linear-gradient(135deg, #4f46e5, #6b21a8)",
            fontFamily: "Tahoma",
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
            marginTop:"20px"
        }}>
            Events List
        </h1>
        {loading && (
            <p style={{
                textAlign: "center",
                fontStyle: "Tahoma",
                color: "#999"
            }}>
                Loading events...
            </p>
        )}
        {error && (
            <p style={{
                color: "red",
                textAlign: "center",
                fontWeight: "bold"
            }}>
                {error}
            </p>
        )}
        {!loading && !error && (
            <>
                <ul style={{
                    listStyle: "none",
                    padding: "0",
                    margin: "0"
                }}>
                    {currentEvents.map((event, index) => (
                        <li key={index} style={{
                            backgroundColor: "#fff",
                            margin: "10px 0",
                            padding: "15px",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span style={{
                                fontWeight: "bold",
                                color: "#6b21a8"
                            }}>
                                {event.event_name}
                            </span>
                            <span style={{
                                color: "#555",
                                fontSize: "14px"
                            }}>
                                {event.event_date}
                            </span>
                        </li>
                    ))}
                </ul>
                {/* Pagination Controls */}
                <div style={{
                    marginTop: "20px",
                    textAlign: "center",
                }}>
                    {[...Array(totalPages).keys()].map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page + 1)}
                            style={{
                                margin: "5px",
                                padding: "10px 15px",
                                backgroundColor: currentPage === page + 1 ? "#007bff" : "#ccc",
                                color: currentPage === page + 1 ? "#fff" : "#333",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>
            </>
        )}
    </div>
  );
};

export { EventList };