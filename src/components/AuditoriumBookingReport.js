import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

function AuditoriumBookingReport({ bookingDetails, navigateToDashboard }) {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h4" className="text-center">
                            Booking Confirmation 
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Auditorium Name:</strong> {bookingDetails.auditorium_name}</p>
                            <p><strong>Event Name:</strong> {bookingDetails.event_name}</p>
                            <p><strong>Event Date:</strong> {bookingDetails.event_date}</p>
                            <p><strong>Start Time:</strong> {bookingDetails.start_time}</p>
                            <p><strong>End Time:</strong> {bookingDetails.end_time}</p>
                            <p><strong>Booked By:</strong> {bookingDetails.staff_email}</p>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="primary" onClick={navigateToStaffDashboard}>
                                DONE
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>++96
            </Row>
        </Container>
    );
}

export default AuditoriumBookingReport;
