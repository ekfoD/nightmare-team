import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const todayStr = new Date().toISOString().split("T")[0];

const isPastDate = (dateStr) => {
  return new Date(dateStr) < new Date(todayStr);
};

export default function CreateDiscountModal({
  show,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setAmount("");
    setApplicableTo("");
    setValidFrom("");
    setValidUntil("");
    setStatus("active");
    setError("");
  };

  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

const handleCreate = () => {
  setError("");

  /* ===== Required fields ===== */
  if (!name.trim()) {
    setError("Discount name is required.");
    return;
  }

  if (!amount || !applicableTo || !validFrom || !validUntil) {
    setError("All fields are required.");
    return;
  }

  /* ===== Amount ===== */
  const amountNumber = Number(amount);

  if (isNaN(amountNumber)) {
    setError("Amount must be a number.");
    return;
  }

  if (amountNumber <= 0) {
    setError("Discount amount must be greater than 0.");
    return;
  }

  // Optional upper bound safety (adjust if needed)
  if (amountNumber >= 100) {
    setError("Discount amount is unrealistically large.");
    return;
  }

  /* ===== Applicable to ===== */
  if (!["order", "item"].includes(applicableTo)) {
    setError("Invalid discount type.");
    return;
  }

  /* ===== Dates ===== */
  if (isPastDate(validFrom)) {
    setError("Valid From date cannot be in the past.");
    return;
  }

  if (new Date(validUntil) < new Date(validFrom)) {
    setError("Valid Until must be after Valid From.");
    return;
  }

  /* ===== Status consistency ===== */
  if (status === "active" && isPastDate(validUntil)) {
    setError("An active discount cannot already be expired.");
    return;
  }

  /* ===== Create ===== */
  onCreate({
    name: name.trim(),
    amount: amountNumber,
    applicableTo,
    validFrom,
    validUntil,
    status,
  });

  resetForm();
  onClose();
};

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Discount</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Discount Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Applicable To</Form.Label>
            <Form.Select
              value={applicableTo}
              onChange={(e) => setApplicableTo(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="order">Order/Appointment</option>
              <option value="item">Item/Service</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valid From</Form.Label>
            <Form.Control
              type="date"
              min={todayStr}
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valid Until</Form.Label>
            <Form.Control
              type="date"
              min={validFrom || todayStr}
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
