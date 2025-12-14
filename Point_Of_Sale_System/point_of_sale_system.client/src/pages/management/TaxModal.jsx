import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaxModal = ({ show, tax, onSave, onCancel }) => {

    const NUMBER_TYPE = {
        FLAT: 1,
        PERCENTAGE: 2
    };

    const NUMBER_TYPE_LABEL = {
        1: "Flat",
        2: "Percentage"
    };

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [numberType, setNumberType] = useState(NUMBER_TYPE.FLAT);
    const [status, setStatus] = useState(1);
    const [error, setError] = useState(null); // State for general submission error

    useEffect(() => {
        if (!show) return;

        if (tax) {
            setName(tax.name ?? "");
            setAmount(String(tax.amount ?? ""));
            setNumberType(tax.numberType ?? NUMBER_TYPE.FLAT);
            setStatus(tax.status ?? 1);
        } else {
            // ADD MODE (tax === null)
            setName("");
            setAmount("");
            setNumberType(NUMBER_TYPE.FLAT);
            setStatus(1);
        }

        setError(null);
    }, [tax, show]);

    const isFormValid = () => {
        // 1. Check for Tax Name
        if (!name.trim()) {
            setError("Tax Name is required.");
            return false;
        }

        const numericAmount = parseFloat(amount);

        // 2. Check for Amount (required and numeric)
        if (amount === "" || isNaN(numericAmount)) {
            setError("Amount is required and must be a number.");
            return false;
        }

        // Note: The non-negative check is enforced in handleSubmit, but
        // we can set a soft error here if needed.

        setError(null);
        return true;
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            return; // Stop submission if validation fails
        }

        // Enforce non-negative amount using Math.max(0, X)
        const finalAmount = Math.max(0, parseFloat(amount));
        onSave({
            id: tax?.id,
            name: name.trim(),
            amount: finalAmount,
            numberType: numberType,
            status: Number(status)
        });
    };

    // Disabled state based on simple field checks for the button UX
    const isSaveDisabled = !name.trim() || amount === "" || isNaN(parseFloat(amount));

    // Determine invalid state for input fields
    const isNameInvalid = !name.trim() && show;
    const isAmountInvalid = (amount === "" || isNaN(parseFloat(amount))) && show;

    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{tax ? "Edit Tax" : "Add Tax"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* General Error Message Display */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tax Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError(null);
                            }}
                            required
                            isInvalid={isNameInvalid} // Apply invalid state
                        />
                        <Form.Control.Feedback type="invalid">
                            Tax name is required.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0" // HTML validation hint for non-negative
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError(null);
                            }}
                            required
                            isInvalid={isAmountInvalid} // Apply invalid state
                        />
                        <Form.Control.Feedback type="invalid">
                            Amount is required and must be a valid number.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Number Type</Form.Label>
                        <Form.Select
                            value={numberType}
                            onChange={(e) => setNumberType(parseInt(e.target.value))}
                        >
                            <option value={NUMBER_TYPE.FLAT}>Flat</option>
                            <option value={NUMBER_TYPE.PERCENTAGE}>Percentage</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value={1}>Active</option>
                            <option value={2}>Inactive</option>
                            <option value={3}>Unavailable</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-center gap-3">
                <Button variant="secondary" onClick={onCancel} style={{ minWidth: "120px" }}>Cancel</Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    style={{ minWidth: "120px" }}
                    disabled={isSaveDisabled} // Disable button if fields are incomplete
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaxModal;