import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const todayStr = new Date().toISOString().split("T")[0];

const isPastDate = (dateStr) => {
  return new Date(dateStr) < new Date(todayStr);
};

export default function EditDiscountModal({
  show,
  onClose,
  onUpdate,
  discount,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (discount && show) {
      setName(discount.name || "");
      setAmount(discount.amount?.toString() || "");
      setApplicableTo(discount.applicableTo || "");
      setValidFrom(discount.validFrom || "");
      setValidUntil(discount.validUntil || "");
      setStatus(discount.status ?? "active");
      setError("");
    }

    if (!show) resetForm();
  }, [discount, show]);

  const resetForm = () => {
    setAmount("");
    setApplicableTo("");
    setValidFrom("");
    setValidUntil("");
    setStatus("active");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdate = () => {
  setError("");

  /* ===== Required ===== */
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
    setError("Amount must be greater than 0.");
    return;
  }

  if (amountNumber > 100) {
    setError("Discount amount is unrealistically large.");
    return;
  }

  /* ===== Applicability ===== */
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

  /* ===== Status logic ===== */
  if (status === "active" && isPastDate(validUntil)) {
    setError("An active discount cannot already be expired.");
    return;
  }

  /* ===== Update ===== */
  onUpdate({
    ...discount,
    name: name.trim(),
    amount: amountNumber,
    applicableTo,
    validFrom,
    validUntil,
    status,
  });

  onClose();
};


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Discount</Modal.Title>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdate}
          disabled={
            !name.trim() ||
            !amount ||
            !applicableTo ||
            !validFrom ||
            !validUntil
          }
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
