import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const BookingReportModal = ({ report }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={styles.modalTitle}>📜 Booking Report</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {report && report.length > 0 ? (
            <div style={styles.scrollableContent}>
              <ul style={styles.list}>
                {report.map((booking, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong style={styles.eventName}>{booking.event_name}</strong> 
                    <br />
                    Time: {booking.start_time} - {booking.end_time}
                    <br />
                    Date: {booking.event_date}
                    <br />
                    Booked by: {booking.staff_email}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Inline Styling
const styles = {
  openButton: {
    margin: "20px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
  },
  modalTitle: {
    fontWeight: "bold",
    color: "#007bff",
  },
  modalBody: {
    maxHeight: "400px", // Ensures the modal body isn't too large
    overflowY: "auto", // Enables vertical scrolling
    padding: "10px",
  },
  scrollableContent: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  eventName: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#343a40",
  },
};

export default BookingReportModal;