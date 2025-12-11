import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// helper: parse service.duration to minutes
const parseDurationToMinutes = (duration) => {
  if (!duration) return 30;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length >= 2) return parts[0]*60 + parts[1];
  return parseInt(duration, 10) || 30;
};

// overlap checker
const doesOverlap = (newStart, newEnd, employeeId, allAppts, excludeId = null) => {
  return allAppts.some(a => {
    if (excludeId && a.id === excludeId) return false;
    if (a.employeeId !== employeeId) return false;
    const s = new Date(a.startTime);
    const e = new Date(a.endTime);
    return newStart < e && s < newEnd;
  });
};

const NewAppointmentPopup = ({ show, handleClose, onSuccess, workers, services, timeSlots, selectedDate, allAppointments, organizationId }) => {
  const [service, setService] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // initialize defaults
    setDate(selectedDate ? selectedDate.toISOString().slice(0,10) : "");
    if (services && services.length && !service) setService(services[0]);
    if (workers && workers.length && !employeeId) setEmployeeId(workers[0].id);
    if (timeSlots && timeSlots.length && !time) setTime(timeSlots[0]);
  }, [show, services, workers, timeSlots, selectedDate]);

  const reset = () => {
    setService(services && services.length ? services[0] : "");
    setEmployeeId(workers && workers.length ? workers[0].id : "");
    setTime(timeSlots && timeSlots.length ? timeSlots[0] : "");
    setCustomerName("");
    setCustomerPhone("");
    setExtraInfo("");
    setDate(selectedDate ? selectedDate.toISOString().slice(0,10) : "");
  };

  const handleSave = async () => {
    if (!service || !employeeId || !time || !customerName || !date) {
      alert("Fill required fields.");
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const durationMins = parseDurationToMinutes(30); // default duration since string services don't have duration
    const end = new Date(start.getTime() + durationMins*60000);

    if (doesOverlap(start, end, employeeId, allAppointments)) {
      alert("This appointment overlaps with an existing appointment for this employee.");
      return;
    }

    const payload = {
      employeeId,
      employeeName: workers.find(w => w.id === employeeId)?.name,
      menuServiceId: service,  // using string as ID
      serviceName: service,
      startTime: start.toISOString(),
      customerName,
      customerPhone,
      extraInfo,
      organizationId
    };

    try {
      await axios.post("https://localhost:7079/api/appointments/create", payload);
      onSuccess && onSuccess("Appointment created");
      reset();
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to create appointment");
    }
  };

  return (
    <Modal show={show} onHide={() => { reset(); handleClose(); }} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
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
        <Button variant="secondary" onClick={() => { reset(); handleClose(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Appointment</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAppointmentPopup;
