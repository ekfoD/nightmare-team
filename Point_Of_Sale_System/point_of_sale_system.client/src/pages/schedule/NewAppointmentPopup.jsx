import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// Helpers
const parseDurationToMinutes = (duration) => {
  if (!duration) return 30;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  return parts.length === 2 ? parts[0]*60 + parts[1] : parseInt(duration, 10) || 30;
};

const doesOverlap = (newStart, newEnd, employeeId, allAppts, excludeId = null) =>
  allAppts.some(a => a.employeeId === employeeId && a.id !== excludeId &&
                     newStart < new Date(a.endTime) && new Date(a.startTime) < newEnd);

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

  // Initialize defaults when popup opens
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
    const { service, employeeId, date, time, customerName, customerPhone, extraInfo } = form;
    if (!service || !employeeId || !time || !customerName || !date) return alert("Fill required fields.");

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + parseDurationToMinutes(service.duration)*60000);

    if (doesOverlap(start, end, employeeId, allAppointments)) 
      return alert("This appointment overlaps with an existing appointment for this employee.");

    try {
      await axios.post("https://localhost:7079/api/appointments/create", {
        employeeId,
        employeeName: workers.find(w => w.id === employeeId)?.name,
        serviceName: service.name,
        startTime: start.toISOString(),
        customerName,
        customerPhone,
        extraInfo,
        organizationId
      });
      onSuccess && onSuccess("Appointment created");
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
          <Form.Select value={form.service?.name || ""} onChange={e => setForm(f => ({ ...f, service: services.find(s => s.name === e.target.value) }))}>
            <option value="">Select service</option>
            {services.map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Employee *</Form.Label>
          <Form.Select value={form.employeeId} onChange={handleChange("employeeId")}>
            <option value="">Select employee</option>
            {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date & Time *</Form.Label>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Form.Control type="date" value={form.date} onChange={handleChange("date")} style={{flex:1}} />
            <Form.Control type="time" value={form.time} onChange={handleChange("time")} style={{flex:1}} />
            <Form.Control type="text" value={computeEndTime()} readOnly placeholder="End time" style={{width:'90px', fontSize:'0.85rem', textAlign:'center', backgroundColor:'#f0f0f0'}} />
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
