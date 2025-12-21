import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function CreateServiceModal({
  show,
  onClose,
  onCreate,
  currency,
  discounts,
  taxes = [],
}) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [error, setError] = useState("");
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);

  const resetForm = () => {
    setName("");
    setDuration("");
    setPrice("");
    setDescription("");
    setSelectedTaxIds([]);
    setSelectedDiscountId(null);
    setIsActive("Active");
    setError("");
  };

  const currencySymbol =
    {
      euro: "€",
      dollar: "$",
    }[currency] ?? "";

    useEffect(() => {
      if (!show) resetForm();
    }, [show]);

    const handleCreate = () => {
    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    /* ---------- NAME ---------- */
    if (!trimmedName) {
      setError("Service name cannot be empty.");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Service name must be at least 3 characters long.");
      return;
    }

    if (trimmedName.length > 40) {
      setError("Service name cannot exceed 40 characters.");
      return;
    }

    /* ---------- DESCRIPTION ---------- */
    if (!trimmedDescription) {
      setError("Description cannot be empty.");
      return;
    }

    if (trimmedDescription.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    /* ---------- DURATION ---------- */
    const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!durationRegex.test(duration)) {
      setError("Duration must be in HH:MM format.");
      return;
    }

    const [hours, minutes] = duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes < 5) {
      setError("Duration must be at least 5 minutes.");
      return;
    }

    if (totalMinutes > 16 * 60) {
      setError("Duration cannot exceed 16 hours.");
      return;
    }

    /* ---------- PRICE ---------- */
    const priceNumber = Number(price);

    if (!Number.isFinite(priceNumber)) {
      setError("Price must be a valid number.");
      return;
    }

    if (priceNumber <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (priceNumber > 1_000_000) {
      setError("Price is unrealistically high.");
      return;
    }

    /* ---------- TAXES ---------- */
    if (!Array.isArray(selectedTaxIds) || selectedTaxIds.length === 0) {
      setError("At least one tax must be selected.");
      return;
    }

    const validTaxIds = new Set(taxes.map(t => t.id));
    if (!selectedTaxIds.every(id => validTaxIds.has(id))) {
      setError("Invalid tax selection.");
      return;
    }

    /* ---------- DISCOUNT ---------- */
    if (
      selectedDiscountId &&
      !discounts.some(d => d.id === selectedDiscountId)
    ) {
      setError("Invalid discount selected.");
      return;
    }

    const newService = {
      name,
      durationMinutes: totalMinutes,
      price: priceNumber,
      description,
      status: isActive,
      taxIds: selectedTaxIds,
      discountId: selectedDiscountId,
    };

    onCreate(newService);
    resetForm();
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
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (HH:MM)</Form.Label>
            <Form.Control
              type="text"
              placeholder="00:30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price ({currencySymbol})</Form.Label>
            <Form.Control
              type="number"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* ✅ TAXES */}
          <Form.Group className="mb-3">
            <Form.Label>Taxes *</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedTaxIds}
              onChange={(e) =>
                setSelectedTaxIds(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              {taxes.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.name} — {tax.amount}
                  {tax.numberType === "percentage" ? "%" : ""}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* ✅ DISCOUNT WITH LABEL */}
          <Form.Group className="mb-3">
            <Form.Label>Discount</Form.Label>
            <Form.Select
              value={selectedDiscountId || ""}
              onChange={(e) =>
                setSelectedDiscountId(e.target.value || null)
              }
            >
              <option value="">None</option>
              {discounts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.amount}
                  {d.numberType === "percentage" ? "%" : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
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
