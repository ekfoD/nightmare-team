import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const parseDurationToMinutes = (duration) => {
  if (!duration) return 30;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length >= 2) return parts[0] * 60 + parts[1];
  return parseInt(duration, 10) || 30;
};

// Check overlapping appointments
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
  show,
  handleClose,
  appointment,
  workers,
  services,
  timeSlots,
  selectedDate,
  onSuccess,
  allAppointments,
  organizationId
}) => {
  const [service, setService] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [date, setDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Initialize form when appointment changes
  useEffect(() => {
    if (!appointment) {
      resetForm();
      return;
    }

    // Set service object
    const serviceObj = services.find(s => s.name === appointment.serviceName) || null;
    setService(serviceObj);

    setEmployeeId(appointment.employeeId || "");
    setTime(appointment.startTime ? new Date(appointment.startTime).toTimeString().substring(0,5) : "");
    setCustomerName(appointment.customerName || "");
    setCustomerPhone(appointment.customerPhone || "");
    setExtraInfo(appointment.extraInfo || "");
    setDate(appointment.startTime ? new Date(appointment.startTime).toISOString().slice(0,10) : "");
    
    if (appointment.startTime && serviceObj?.duration) {
      const start = new Date(appointment.startTime);
      const durationMins = parseDurationToMinutes(serviceObj.duration);
      const end = new Date(start.getTime() + durationMins * 60000);
      setEndTime(end.toTimeString().substring(0,5));
    } else {
      setEndTime("");
    }
  }, [appointment, services]);

  const resetForm = () => {
    setService(null);
    setEmployeeId(workers.length ? workers[0].id : "");
    setTime(timeSlots.length ? timeSlots[0] : "");
    setCustomerName("");
    setCustomerPhone("");
    setExtraInfo("");
    setDate(selectedDate ? selectedDate.toISOString().slice(0,10) : "");
    setEndTime("");
  };

  // Update end time automatically when service changes
  useEffect(() => {
    if (!service || !time || !date) return;
    const start = new Date(`${date}T${time}:00`);
    const durationMins = parseDurationToMinutes(service.duration);
    const end = new Date(start.getTime() + durationMins * 60000);
    setEndTime(end.toTimeString().substring(0,5));
  }, [service, time, date]);

  const handleSave = async () => {
    if (!service || !employeeId || !time || !customerName || !date) {
      alert("Fill required fields.");
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const durationMins = parseDurationToMinutes(service.duration);

    
    const end = new Date(start.getTime() + durationMins * 60000);

    if (doesOverlap(start, end, employeeId, allAppointments, appointment?.id)) {
      alert("This appointment overlaps with an existing appointment for this employee.");
      return;
    }

    const payload = {
      employeeId,
      employeeName: workers.find(w => w.id === employeeId)?.name,
      menuServiceId: service.name, // or ID if you have one
      serviceName: service.name,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
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
    <Modal show={show} onHide={() => { resetForm(); handleClose(); }} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Service *</Form.Label>
          <Form.Select value={service?.name || ""} onChange={e => {
            const selected = services.find(s => s.name === e.target.value);
            setService(selected);
          }}>
            <option value="">Select service</option>
            {services.map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)}
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
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Form.Control type="date" value={date} onChange={e => setDate(e.target.value)} style={{flex:1}} />
            <Form.Select value={time} onChange={e => setTime(e.target.value)} style={{flex:1}}>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
            <Form.Control 
              type="text" 
              value={endTime} 
              readOnly 
              placeholder="End time" 
              style={{width:'90px', fontSize:'0.85rem', textAlign:'center', backgroundColor:'#f0f0f0'}}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <div style={{ display:'flex', gap:8 }}>
            <div style={{flex:2}}>
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div style={{flex:1}}>
              <Form.Label>Phone</Form.Label>
              <Form.Control value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            </div>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Extra Info</Form.Label>
          <Form.Control as="textarea" rows={2} value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        <Button variant="secondary" onClick={() => { resetForm(); handleClose(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAppointmentPopup;
