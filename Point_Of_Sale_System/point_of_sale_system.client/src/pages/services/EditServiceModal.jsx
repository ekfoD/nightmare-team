import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function EditServiceModal({ show, onClose, onUpdate, service }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(""); // "HH:MM"
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [error, setError] = useState("");

  // Prefill form when modal opens or service changes
  useEffect(() => {
  if (service) {
    setName(service.name);

    const hours = Math.floor(service.duration / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (service.duration % 60)
      .toString()
      .padStart(2, "0");
    setDuration(`${hours}:${minutes}`);

    setPrice(service.price.toString());
    setDescription(service.description);

    // Ensure status is exactly "Active" or "Inactive"
    setIsActive(service.status === "inactive" ? "Inactive" : "Active");

    setError("");
  } else if (!show) {
    resetForm();
  }
}, [show, service]);

  const resetForm = () => {
    setName("");
    setDuration("");
    setPrice("");
    setDescription("");
    setIsActive("Active");
    setError("");
  };

  const handleUpdate = () => {
    setError("");

    if (!name || !duration || !price || !description) {
      setError("All fields are required.");
      return;
    }

    const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!durationRegex.test(duration)) {
      setError("Duration must be in HH:MM format.");
      return;
    }

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

    // ---- VALIDATED: UPDATE OBJECT ----
    const updatedService = {
      ...service,
      name,
      duration: totalMinutes,
      price: priceNumber,
      description,
      status: isActive,
    };

    onUpdate(updatedService);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Service</Modal.Title>
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
              step="0.01"
              required
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
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
}
