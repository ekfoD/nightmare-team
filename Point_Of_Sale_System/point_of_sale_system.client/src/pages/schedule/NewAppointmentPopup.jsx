import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from '../../api/axios.js';
import { workStart, workEnd, isWithinWorkHours, parseDurationToMinutes, doesOverlap, isPastDate, isPastDateTime } from './utils/ScheduleHelpers';

const NewAppointmentPopup = ({ show, handleClose, onSuccess, workers, services, selectedDate, allAppointments, organizationId }) => {
  const [form, setForm] = useState({
    service: services[0] || null,
    employeeId: workers[0]?.id || "",
    date: selectedDate?.toISOString().slice(0,10) || "",
    time: "",
    customerName: "",
    customerPhone: "",
    extraInfo: ""
  });

  useEffect(() => {
    setForm(f => ({
      ...f,
      service: services[0] || null,
      employeeId: workers[0]?.id || "",
      date: selectedDate?.toISOString().slice(0,10) || "",
      time: ""
    }));
  }, [show, services, workers, selectedDate]);

  const handleChange = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const computeEndTime = () => {
    if (!form.service || !form.time || !form.date) return "";
    const start = new Date(`${form.date}T${form.time}:00`);
    const end = new Date(start.getTime() + parseDurationToMinutes(form.service.duration) * 60000);
    return end.toTimeString().substring(0,5);
  };

  const resetForm = () => setForm({
    service: services[0] || null,
    employeeId: workers[0]?.id || "",
    date: selectedDate?.toISOString().slice(0,10) || "",
    time: "",
    customerName: "",
    customerPhone: "",
    extraInfo: ""
  });

  const handleSave = async () => {
  const {
    service,
    employeeId,
    date,
    time,
    customerName,
    customerPhone,
    extraInfo
  } = form;

  /* ===== Required fields ===== */
  if (!service || !employeeId || !date || !time || !customerName.trim()) {
    return alert("Please fill all required fields.");
  }

  /* ===== Invalid date ===== */
  if (isPastDate(date)) {
    return alert("You cannot create an appointment before today.");
  }

  /* ===== Invalid time today ===== */
  if (isPastDateTime(date, time)) {
    return alert("You cannot create an appointment in the past.");
  }

  /* ===== Service duration ===== */
  const durationMinutes = parseDurationToMinutes(service.duration);
  if (!durationMinutes || durationMinutes <= 0) {
    return alert("Invalid service duration.");
  }

  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  /* ===== Work hours ===== */
  if (!isWithinWorkHours(time)) {
    return alert(`Time must be between ${workStart} and ${workEnd}.`);
  }

  const endTimeStr = end.toTimeString().substring(0, 5);
  if (!isWithinWorkHours(endTimeStr)) {
    return alert("Appointment ends outside of working hours.");
  }

  /* ===== Overlap ===== */
  if (doesOverlap(start, end, employeeId, allAppointments)) {
    return alert(
      "This appointment overlaps with an existing appointment for this employee."
    );
  }

  /* ===== Employee sanity ===== */
  const employee = workers.find(w => String(w.id) === String(employeeId));
  if (!employee) {
    return alert("Please select a valid employee.");
  }

  /* ===== API ===== */
  try {
    await api.post("https://localhost:7079/api/appointments/create", {
      employeeId: employee.id,
      employeeName: employee.name,
      serviceName: service.name,
      startTime: `${date}T${time}`,
      customerName,
      customerPhone,
      extraInfo,
      organizationId
    });

    onSuccess?.("Appointment created");
    resetForm();
    handleClose();
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.error || "Failed to create appointment");
  }
};

  return (
    <Modal show={show} onHide={() => { resetForm(); handleClose(); }} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Service *</Form.Label>
          <Form.Select
            value={form.service?.name || ""}
            onChange={e => setForm(f => ({ ...f, service: services.find(s => s.name === e.target.value) }))}
          >
            <option value="">Select service</option>
            {services.map(s => (
              <option key={s.id || s.name} value={s.name}>{s.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Employee *</Form.Label>
          <Form.Select
            value={form.employeeId}
            onChange={handleChange("employeeId")}
          >
            <option value="">Select employee</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date & Time *</Form.Label>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Form.Control type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={handleChange("date")} style={{flex:1}} />
            <Form.Control type="time" value={form.time} onChange={handleChange("time")} style={{flex:1}} />
            <Form.Control type="text" value={computeEndTime()} readOnly placeholder="End time"
              style={{width:'90px', fontSize:'0.85rem', textAlign:'center', backgroundColor:'#f0f0f0'}}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <div style={{ display:'flex', gap:8 }}>
            <Form.Control placeholder="Customer Name *" value={form.customerName} onChange={handleChange("customerName")} style={{flex:2}} />
            <Form.Control placeholder="Phone" value={form.customerPhone} onChange={handleChange("customerPhone")} style={{flex:1}} />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control as="textarea" rows={2} placeholder="Extra Info" value={form.extraInfo} onChange={handleChange("extraInfo")} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => { resetForm(); handleClose(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Appointment</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAppointmentPopup;
