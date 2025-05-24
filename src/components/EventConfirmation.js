import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EventConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { confirmationId, eventDetails } = location.state || {};

    return (
        <div style={{ 
            fontFamily: "Arial, sans-serif", 
            backgroundColor: "#f9f9f9", 
            margin: "50px auto", 
            padding: "30px", 
            width: "80%", 
            maxWidth: "600px", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
            borderRadius: "10px" 
        }}>
            <h1 style={{ 
                color: "#6f42c1", 
                textAlign: "center", 
                marginBottom: "20px" 
            }}>
                Event Confirmation
            </h1>
            {eventDetails ? (
                <div>
                    {/* <p style={{ 
                        fontSize: "18px", 
                        color: "#333", 
                        marginBottom: "10px" 
                    }}>
                        <strong>Confirmation ID:</strong> {confirmationId}
                    </p> */}
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "10px" 
                    }}>
                        <strong>Event Name:</strong> {eventDetails.event_name}
                    </p>
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "10px" 
                    }}>
                        <strong>Event Date:</strong> {eventDetails.event_date}
                    </p>
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "10px" 
                    }}>
                        <strong>Start Time:</strong> {eventDetails.start_time}
                    </p>
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "10px" 
                    }}>
                        <strong>End Time:</strong> {eventDetails.end_time}
                    </p>
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "10px" 
                    }}>
                        <strong>Auditorium:</strong> {eventDetails.auditorium_name}
                    </p>
                    <p style={{ 
                        fontSize: "16px", 
                        color: "#555", 
                        marginBottom: "20px" 
                    }}>
                        <strong>Booked by:</strong> {eventDetails.staff_email}
                    </p>
                    <p style={{ 
                        fontSize: "18px", 
                        color: "#6f42c1", 
                        textAlign: "center", 
                        marginTop: "20px" 
                    }}>
                        🎉 Your event has been successfully booked!
                    </p>
                </div>
            ) : (
                <p style={{ 
                    fontSize: "18px", 
                    color: "#FF0000", 
                    textAlign: "center", 
                    marginTop: "20px" 
                }}>
                    Booking details are unavailable.
                </p>
            )}
            <button 
                onClick={() => navigate("/staff-dashboard")} 
                style={{
                    display: "block",
                    margin: "30px auto 0",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#6f42c1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    textAlign: "center"
                }}
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default EventConfirmation;