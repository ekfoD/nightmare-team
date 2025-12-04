import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const NewAppointmentPopup = ({ show, handleClose, workers, services, timeSlots }) => {
  const [service, setService] = useState("");
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  // Clears all fields
  const resetFields = () => {
    setService("");
    setWorker("");
    setDate("");
    setTime("");
    setExtraInfo("");
  };

  // Close button clears fields + closes
  const onClose = () => {
    resetFields();
    handleClose();
  };

  // Save button now checks all required fields
  const onSave = () => {
    if (!date || !time || !service || !worker) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Saving appointment:");
    console.log({ service, worker, date, time, extraInfo });

    resetFields();
    handleClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.8rem" }}>
          New Appointment
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "25px" }}>
        {/* Date */}
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Date *
          </Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        {/* TIME SLOT */}
        <Form.Group className="mb-3">
          <Form.Label>Time Slot *</Form.Label>
          <Form.Select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">Select a time</option>
            {timeSlots.map((t, idx) => (
              <option key={idx} value={t}>
                {t}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Service + Worker side-by-side */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Service Type *</Form.Label>
              <Form.Select
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              >
                <option value="">Select a service</option>
                {services.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Worker *</Form.Label>
              <Form.Select
                value={worker}
                onChange={(e) => setWorker(e.target.value)}
                required
              >
                <option value="">Select a worker</option>
                {workers.map((w, idx) => (
                  <option key={idx} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Extra info (NOT required) */}
        <Form.Group className="mb-3">
          <Form.Label>Extra Information (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAppointmentPopup;
