import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function EditServiceModal({
  show,
  onClose,
  onUpdate,
  service,
  taxes = [],
  discounts = []
}) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("00:00");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState("");
  const [error, setError] = useState("");

  // When service or show changes, populate the form
  useEffect(() => {
    if (service && show) {
      setName(service.name || "");
      const hours = Math.floor(service.duration / 60).toString().padStart(2, "0");
      const minutes = (service.duration % 60).toString().padStart(2, "0");
      setDuration(`${hours}:${minutes}`);
      setPrice(service.price?.toString() || "");
      setDescription(service.description || "");
      setIsActive(service.status?.toLowerCase() === "inactive" ? "Inactive" : "Active");
      setSelectedTaxIds(service.taxes?.map(t => t.id.toString()) || []);
      setSelectedDiscountId(service.discountId ? service.discountId.toString() : "");
      setError("");
    }

    if (!show) resetForm();
  }, [service, show]);

  const resetForm = () => {
    setName("");
    setDuration("00:00");
    setPrice("");
    setDescription("");
    setIsActive("Active");
    setSelectedTaxIds([]);
    setSelectedDiscountId("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currencySymbol = { euro: "€", dollar: "$" }[service?.currency] || "$";

  const handleUpdate = () => {
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

  if (trimmedName.length > 30) {
    setError("Service name cannot exceed 30 characters.");
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

  const validTaxIds = new Set(taxes.map(t => t.id.toString()));
  if (!selectedTaxIds.every(id => validTaxIds.has(id))) {
    setError("Invalid tax selection.");
    return;
  }

  /* ---------- DISCOUNT ---------- */
  if (
    selectedDiscountId &&
    !discounts.some(d => d.id.toString() === selectedDiscountId)
  ) {
    setError("Invalid discount selected.");
    return;
  }

    onUpdate({
      ...service,
      name,
      duration: totalMinutes,
      price: priceNumber,
      description,
      status: isActive,
      taxIds: selectedTaxIds,
      discountId: selectedDiscountId || null
    });

    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (HH:MM)</Form.Label>
            <Form.Control
              type="text"
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

          <Form.Group className="mb-3">
            <Form.Label>Taxes *</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedTaxIds}
              onChange={(e) =>
                setSelectedTaxIds(Array.from(e.target.selectedOptions, opt => opt.value))
              }
            >
              {taxes.map((tax) => (
                <option key={tax.id} value={tax.id.toString()}>
                  {tax.name} ({tax.amount?.parsedValue}{tax.numberType === "percentage" ? "%" : ""})
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount</Form.Label>
            <Form.Select
              value={selectedDiscountId}
              onChange={(e) => setSelectedDiscountId(e.target.value)}
            >
              <option value="">None</option>
              {discounts.map((d) => (
                <option key={d.id} value={d.id.toString()}>
                  {d.name} — {d.amount}{d.applicableTo === "item" ? "%" : ""}
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
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdate}
          disabled={selectedTaxIds.length === 0}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
