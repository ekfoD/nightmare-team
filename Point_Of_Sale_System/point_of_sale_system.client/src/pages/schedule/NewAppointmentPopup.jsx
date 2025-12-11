import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { doesAppointmentOverlap } from './doesAppointmentOverlap';
import axios from "axios";

const NewAppointmentPopup = ({ show, handleClose, workers, services, timeSlots, onSuccess }) => {
  const [service, setService] = useState("");
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const organizationId = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

  const resetFields = () => {
    setService("");
    setWorker("");
    setDate("");
    setTime("");
    setExtraInfo("");
    setCustomerName("");
    setCustomerPhone("");
    setErrMsg("");
  };

  const onClose = () => {
    resetFields();
    handleClose();
  };

  const calculateEndTime = (date, startTime, serviceName) => {
    const serviceObj = services.find(s => s.name === serviceName);
    if (!serviceObj) return `${date}T${startTime}:00`;

    const [hours, minutes] = startTime.split(":").map(Number);
    const durationMinutes = serviceObj.durationMinutes || 30;
    const endDate = new Date(date);
    endDate.setHours(hours, minutes + durationMinutes, 0, 0);

    const hh = String(endDate.getHours()).padStart(2, "0");
    const mm = String(endDate.getMinutes()).padStart(2, "0");
    return `${date}T${hh}:${mm}:00`;
  };

  const onSave = async () => {
    if (!date || !time || !service || !worker || !customerName || !customerPhone) {
      setErrMsg("Please fill in all required fields.");
      return;
    }
    const start = new Date(`${selectedDate}T${selectedTime}`);
    const end = new Date(start.getTime() + selectedService.durationMinutes * 60000);

    if (doesAppointmentOverlap(start, end, selectedEmployeeId, appointments)) {
        alert("This appointment overlaps with an existing appointment.");
        return;
    }

    try {
      await axios.post(`https://localhost:7079/api/appointments/create`, {
        organizationId,
        employeeName: worker,
        serviceName: service,
        startTime: `${date}T${time}:00`,
        endTime: calculateEndTime(date, time, service),
        extraInfo,
        customerName,
        customerPhone
      });

      resetFields();
      handleClose();
      if (onSuccess) onSuccess("Appointment created successfully!");
    } catch (error) {
      console.error("Failed to create appointment:", error);
      setErrMsg(error.response?.data?.message || error.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.8rem" }}>New Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "25px" }}>
        {errMsg && <div style={{ color: "red", marginBottom: "10px" }}>{errMsg}</div>}

        {/* Date */}
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: "1.3rem", fontWeight: "600" }}>Date *</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Form.Group>

        {/* Time */}
        <Form.Group className="mb-3">
          <Form.Label>Time Slot *</Form.Label>
          <Form.Select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">Select a time</option>
            {timeSlots.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Customer Name + Phone (top row) */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Customer Phone *</Form.Label>
              <Form.Control type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>

        {/* Service + Worker (second row) */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Service Type *</Form.Label>
              <Form.Select value={service} onChange={(e) => setService(e.target.value)} required>
                <option value="">Select a service</option>
                {services.map((s, idx) => (
                  <option key={idx} value={s.name}>{s.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Worker *</Form.Label>
              <Form.Select value={worker} onChange={(e) => setWorker(e.target.value)} required>
                <option value="">Select a worker</option>
                {workers.map((w, idx) => (
                  <option key={idx} value={w.name}>{w.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Extra info */}
        <Form.Group className="mb-3">
          <Form.Label>Extra Information (optional)</Form.Label>
          <Form.Control as="textarea" rows={2} value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onSave}>Save Appointment</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAppointmentPopup;
