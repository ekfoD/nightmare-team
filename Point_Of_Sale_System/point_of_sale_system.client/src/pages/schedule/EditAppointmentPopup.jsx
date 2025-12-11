import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// helper parse duration like in NewAppointmentPopup
const parseDurationToMinutes = (duration) => {
  if (!duration) return 30;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length >= 2) return parts[0] * 60 + parts[1];
  return parseInt(duration, 10) || 30;
};

const doesOverlap = (newStart, newEnd, employeeId, allAppts, excludeId = null) => {
  return allAppts.some(a => {
    if (excludeId && a.id === excludeId) return false;
    if (a.employeeId !== employeeId) return false;
    const s = new Date(a.startTime);
    const e = new Date(a.endTime);
    return newStart < e && s < newEnd;
  });
};

const EditAppointmentPopup = ({ 
  show, handleClose, appointment, workers, services, timeSlots, selectedDate, 
  onSuccess, allAppointments, organizationId 
}) => {
  const [service, setService] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [date, setDate] = useState("");

  // Fill form when appointment changes
  useEffect(() => {
    if (!appointment) {
      setService("");
      setEmployeeId("");
      setTime("");
      setCustomerName("");
      setCustomerPhone("");
      setExtraInfo("");
      setDate(selectedDate ? selectedDate.toISOString().slice(0,10) : "");
      return;
    }

    setService(appointment.serviceName || "");
    setEmployeeId(appointment.employeeId || "");
    setTime(appointment.startTime ? new Date(appointment.startTime).toTimeString().substring(0,5) : (appointment.time || ""));
    setCustomerName(appointment.customerName || "");
    setCustomerPhone(appointment.customerPhone || "");
    setExtraInfo(appointment.extraInfo || "");
    setDate(appointment.startTime ? new Date(appointment.startTime).toISOString().slice(0,10) : (appointment.date || ""));
  }, [appointment, selectedDate]);

  const reset = () => {
    setService("");
    setEmployeeId("");
    setTime("");
    setCustomerName("");
    setCustomerPhone("");
    setExtraInfo("");
    setDate(selectedDate ? selectedDate.toISOString().slice(0,10) : "");
  };

  const handleSave = async () => {
    if (!service || !employeeId || !time || !customerName || !date) {
      alert("Fill required fields");
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const durationMins = parseDurationToMinutes(service.duration); // service is just string now, default 30
    const end = new Date(start.getTime() + durationMins * 60000);

    if (doesOverlap(start, end, employeeId, allAppointments, appointment?.id)) {
      alert("This appointment overlaps with an existing appointment for this employee.");
      return;
    }

    const payload = {
      employeeId,
      employeeName: workers.find(w => w.id === employeeId)?.name,
      menuServiceId: service, // just send the string
      serviceName: service,
      startTime: start.toISOString(),
      customerName,
      customerPhone,
      extraInfo,
      organizationId
    };

    try {
      await axios.put(`https://localhost:7079/api/appointments/${appointment.id}/edit`, payload);
      onSuccess && onSuccess("Appointment updated");
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update appointment");
    }
  };

  const handleDelete = async () => {
    if (!appointment) return;
    if (!confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`https://localhost:7079/api/appointments/${appointment.id}/delete`);
      onSuccess && onSuccess("Appointment deleted");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete appointment");
    }
  };

  return (
    <Modal show={show} onHide={() => { reset(); handleClose(); }} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Service *</Form.Label>
          <Form.Select value={service} onChange={e => setService(e.target.value)}>
            <option value="">Select service</option>
            {services.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Employee *</Form.Label>
          <Form.Select value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
            <option value="">Select employee</option>
            {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date & Time *</Form.Label>
          <div style={{ display:'flex', gap:8 }}>
            <Form.Control type="date" value={date} onChange={e => setDate(e.target.value)} />
            <Form.Select value={time} onChange={e => setTime(e.target.value)}>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Customer Name *</Form.Label>
          <Form.Control value={customerName} onChange={e => setCustomerName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Extra Info</Form.Label>
          <Form.Control as="textarea" rows={2} value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        <Button variant="secondary" onClick={() => { reset(); handleClose(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAppointmentPopup;
