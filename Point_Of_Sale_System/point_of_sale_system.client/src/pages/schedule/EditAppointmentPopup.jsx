import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

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
  const [extraInfo, setExtraInfo] = useState("");

  const [original, setOriginal] = useState({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (appointment && show) {
      setService(appointment.service || "");
      setWorker(appointment.worker || "");
      setDate(appointment.date || "");
      setTime(appointment.time || "");
      setExtraInfo(appointment.extraInfo || "");
      setOriginal({
        service: appointment.service || "",
        worker: appointment.worker || "",
        date: appointment.date || "",
        time: appointment.time || "",
        extraInfo: appointment.extraInfo || "",
      });
    }
  }, [appointment, show]);

  const onClose = () => handleClose();

  const onSave = () => {
    if (!date || !time || !service || !worker) {
      alert("Please fill in all required fields.");
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    const updatedFields = {};
    if (service !== original.service) updatedFields.service = service;
    if (worker !== original.worker) updatedFields.worker = worker;
    if (date !== original.date) updatedFields.date = date;
    if (time !== original.time) updatedFields.time = time;
    if (extraInfo !== original.extraInfo) updatedFields.extraInfo = extraInfo;

    console.log("Saved appointment:", { ...appointment, ...updatedFields });
    console.log("Fields edited:", Object.keys(updatedFields));

    setShowSaveConfirm(false);
    handleClose();
    if (onSuccess) onSuccess("Appointment updated successfully!");
  };

  const onDelete = () => setShowDeleteConfirm(true);

  const confirmDelete = () => {
    console.log("Deleted appointment:", appointment);
    setShowDeleteConfirm(false);
    handleClose();
    if (onSuccess) onSuccess("Appointment deleted successfully!");
  };

  return (
    <>
      {/* Main Edit Modal */}
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.8rem" }}>
            Edit Appointment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: "25px" }}>
          {/* Date */}
          <Form.Group className="mb-3">
            <Form.Label>Date *</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={date !== original.date ? { borderColor: "#0d6efd" } : {}}
            />
          </Form.Group>

          {/* Time */}
          <Form.Group className="mb-3">
            <Form.Label>Time Slot *</Form.Label>
            <Form.Select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={time !== original.time ? { borderColor: "#0d6efd" } : {}}
            >
              <option value="">Select a time</option>
              {timeSlots.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Service + Worker */}
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Service Type *</Form.Label>
                <Form.Select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  style={service !== original.service ? { borderColor: "#0d6efd" } : {}}
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
                  style={worker !== original.worker ? { borderColor: "#0d6efd" } : {}}
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

          {/* Extra info */}
          <Form.Group className="mb-3">
            <Form.Label>Extra Information</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              style={extraInfo !== original.extraInfo ? { borderColor: "#0d6efd" } : {}}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal show={showSaveConfirm} onHide={() => setShowSaveConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save changes to this appointment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSave}>
            Yes, Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this appointment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditAppointmentPopup;
