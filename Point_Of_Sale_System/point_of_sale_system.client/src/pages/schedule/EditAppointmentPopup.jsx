import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { doesAppointmentOverlap } from './doesAppointmentOverlap';
import axios from "axios";

const EditAppointmentPopup = ({
  show,
  handleClose,
  appointment,
  workers,
  services,
  timeSlots,
  onSuccess,
}) => {
  const [service, setService] = useState("");
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const organizationId = "8bbb7afb-d664-492a-bcd2-d29953ab924e";

  useEffect(() => {
    if (appointment && show) {
      setService(appointment.service || "");
      setWorker(appointment.worker || "");
      setDate(appointment.date || "");
      setTime(appointment.time || "");
      setCustomerName(appointment.customerName || "");
      setCustomerPhone(appointment.customerPhone || "");
      setExtraInfo(appointment.extraInfo || "");
    }
  }, [appointment, show]);

  const resetFields = () => {
    setService("");
    setWorker("");
    setDate("");
    setTime("");
    setCustomerName("");
    setCustomerPhone("");
    setExtraInfo("");
    setErrMsg("");
  };

  const onClose = () => {
    resetFields();
    handleClose();
  };

  const onSave = async () => {
    if (!date || !time || !service || !worker || !customerName || !customerPhone) {
      setErrMsg("Please fill in all required fields.");
      return;
    }
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    if (doesAppointmentOverlap(start, end, editedEmployeeId, appointments, appointment.id)) {
        alert("This appointment overlaps with an existing appointment.");
        return;
    }

    try {
        axios.put(`https://localhost:7079/api/appointments/${appointment.id}/edit`, {
        organizationId,
        employeeName: worker,
        serviceName: service,
        startTime: `${date}T${time}:00`,
        endTime: calculateEndTime(date, time, service),
        customerName,
        customerPhone,
        extraInfo,
      });

      resetFields();
      handleClose();
      if (onSuccess) onSuccess("Appointment updated successfully!");
    } catch (error) {
      console.error("Failed to update appointment:", error);
      setErrMsg(error.response?.data?.message || error.message);
    }
};

  const onDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
        await axios.delete(`https://localhost:7079/api/appointments/${appointment.id}/delete`);
        resetFields();
        handleClose();
        if (onSuccess) onSuccess("Appointment deleted successfully!");
    } catch (error) {
        console.error("Failed to delete appointment:", error);
        setErrMsg(error.response?.data?.message || error.message);
    }
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

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.8rem" }}>Edit Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "25px" }}>
        {errMsg && <div style={{ color: "red", marginBottom: "10px" }}>{errMsg}</div>}

        {/* Customer Name + Phone */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Customer Phone *</Form.Label>
              <Form.Control value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        {/* Date + Time */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Date *</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Time Slot *</Form.Label>
              <Form.Select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Select a time</option>
                {timeSlots.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Service + Worker */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Service Type *</Form.Label>
              <Form.Select value={service} onChange={(e) => setService(e.target.value)}>
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
              <Form.Select value={worker} onChange={(e) => setWorker(e.target.value)}>
                <option value="">Select a worker</option>
                {workers.map((w, idx) => (
                  <option key={idx} value={w.name}>{w.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Extra Info */}
        <Form.Group className="mb-3">
          <Form.Label>Extra Information</Form.Label>
          <Form.Control as="textarea" rows={2} value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAppointmentPopup;
