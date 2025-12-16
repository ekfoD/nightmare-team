import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

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
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setAmount("");
    setApplicableTo("");
    setValidFrom("");
    setValidUntil("");
    setStatus("Active");
    setError("");
  };

  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

  const handleCreate = () => {
    setError("");

    if (!amount || !applicableTo || !validFrom || !validUntil) {
      setError("All fields are required.");
      return;
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (new Date(validUntil) < new Date(validFrom)) {
      setError("Valid Until must be after Valid From.");
      return;
    }

    onCreate({
      name,
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
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
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
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valid Until</Form.Label>
            <Form.Control
              type="date"
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
