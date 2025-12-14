import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function CreateServiceModal({
  show,
  onClose,
  onCreate,
  currency,
  taxes = [],
}) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setDuration("");
    setPrice("");
    setDescription("");
    setIsActive("Active");
    setSelectedTaxIds([]);
    setError("");
  };

  const currencySymbolMap = {
    euro: "€",
    dollar: "$",
  };
  const currencySymbol = currencySymbolMap[currency] ?? "";

  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

  const handleCreate = () => {
    setError("");

    if (!name || !duration || !price || !description) {
      setError("All fields are required.");
      return;
    }

    // ✅ TAX VALIDATION
    if (selectedTaxIds.length === 0) {
      setError("At least one tax must be selected.");
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

    const newService = {
      name,
      durationMinutes: totalMinutes,
      price: priceNumber,
      description,
      status: isActive,
      taxIds: selectedTaxIds,
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

          {/* ✅ TAX SELECTION */}
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
                  {tax.name} (
                  {tax.amount?.parsedValue}
                  {tax.numberType === "percentage" ? "%" : ""})
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              At least one tax is required. Hold Ctrl (Cmd on Mac) to select
              multiple.
            </Form.Text>
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
        <Button
          variant="success"
          onClick={handleCreate}
          disabled={selectedTaxIds.length === 0}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
