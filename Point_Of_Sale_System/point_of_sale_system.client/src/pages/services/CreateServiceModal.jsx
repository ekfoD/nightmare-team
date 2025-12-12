import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function CreateServiceModal({ show, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(""); // "HH:MM" input
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setDuration("");
    setPrice("");
    setDescription("");
    setIsActive("Active");
    setError("");
  };

  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

  const handleCreate = () => {
    setError("");

    if (!name || !duration || !price || !description) {
      setError("All fields are required.");
      return;
    }

    // Validate HH:MM format
    const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!durationRegex.test(duration)) {
      setError("Duration must be in HH:MM format.");
      return;
    }

    // Convert HH:MM to total minutes
    const [hours, minutes] = duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 0) {
      setError("Duration must be greater than 0 minutes.");
      return;
    }
    if (totalMinutes > 16 * 60) {
      setError("Duration cannot exceed 16 hours.");
      return;
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError("Price must be a number greater than 0.");
      return;
    }

    // ---- VALIDATED: CREATE OBJECT ----
    const newService = {
      id: "TEMP-ID", // optional, only for frontend display
      name,
      durationMinutes: totalMinutes, // <-- send minutes to backend
      price: priceNumber,
      description,
      status: isActive,
    };

    onCreate(newService);
    resetForm(); // optional
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Service</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter service name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (HH:MM)</Form.Label>
            <Form.Control
              type="text"
              placeholder="00:30"
              pattern="^([0-1]\\d|2[0-3]):([0-5]\\d)$"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (€)</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.00"
              required
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              placeholder="Service description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              required
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleCreate}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
