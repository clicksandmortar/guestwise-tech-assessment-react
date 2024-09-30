import React, { useState } from "react";
import { Container, Alert, Form, Button, Row, Col } from "react-bootstrap";

const BookTable: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields (name, email, phone).");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(formData.phone)) {
      setError("Please enter a valid phone number (digits only).");
      return;
    }

    if (formData.guests < 1 || formData.guests > 12) {
      setError(
        "Bookings are limited to a maximum of 12 people. Please contact us directly for larger groups."
      );
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const currentTime = new Date();
    const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour in the future

    if (selectedDateTime < oneHourFromNow) {
      setError("Booking must be scheduled at least 1 hour in the future.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Booking failed");

      setSuccessMessage("Booking successful!");
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      console.log("Completed request");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Book a Table</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="phone" className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="guests" className="mb-3">
              <Form.Label>Guests</Form.Label>
              <Form.Control
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="12"
                required
              />
              <Form.Text className="text-muted">
                Maximum of 12 guests. Contact us for larger bookings.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="date" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="time" className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          Book Now
        </Button>
      </Form>
    </Container>
  );
};

export default BookTable;
