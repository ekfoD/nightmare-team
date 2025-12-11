import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const GiftcardModal = ({ show, giftcard, onSave, onCancel }) => {
    // Initialize balance as a string for input, currency as number, validUntil as string
    const [balance, setBalance] = useState("");
    const [currency, setCurrency] = useState(1);
    const [validUntil, setValidUntil] = useState("");
    const [error, setError] = useState(null); // State to handle validation errors

    useEffect(() => {
        if (giftcard) {
            setBalance(String(giftcard.balance) || ""); // Convert number to string for input
            setCurrency(giftcard.currency);
            setValidUntil(giftcard.validUntil);
        } else {
            setBalance("");
            setCurrency(1); // Set to default currency value (1: Euro)
            setValidUntil("");
        }
        setError(null); // Clear errors whenever the modal opens/changes context
    }, [giftcard, show]); // Added 'show' to ensure state resets when modal closes/reopens

    const currencyOptions = [
        { value: 1, label: "Euro (€)" },
        { value: 2, label: "Dollar ($)" }
    ];

    const isFormValid = () => {
        const numericBalance = parseFloat(balance);
        
        if (!balance || isNaN(numericBalance) || numericBalance <= 0) {
            setError("Balance must be a positive number.");
            return false;
        }

        if (!validUntil) {
            setError("Valid Until date is required.");
            return false;
        }

        // Add more validation here (e.g., date is in the future)

        setError(null);
        return true;
    };


    const handleSubmit = () => {
        if (!isFormValid()) {
            return; // Stop submission if validation fails
        }

        onSave({
            id: giftcard?.id,
            balance: parseFloat(balance), // Ensure final value is parsed before saving
            currency: currency,
            validUntil
        });
    };

    // Calculate disabled state for the Save button
    const isSaveDisabled = !balance || parseFloat(balance) <= 0 || !validUntil;


    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{giftcard ? "Edit Giftcard" : "Add Giftcard"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Display error message if present */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Balance <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="number"
                            min="0.01" // HTML input validation: minimum positive value
                            required // HTML validation attribute
                            value={balance}
                            onChange={(e) => {
                                setBalance(e.target.value);
                                setError(null); // Clear error on input change
                            }}
                            // Apply error styling if balance is invalid
                            isInvalid={balance && parseFloat(balance) <= 0} 
                        />
                        <Form.Control.Feedback type="invalid">
                            Balance must be greater than zero.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                            value={currency}
                            onChange={(e) => setCurrency(parseInt(e.target.value))}
                        >
                            {currencyOptions.map(c => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Valid Until <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="date"
                            required // HTML validation attribute
                            value={validUntil}
                            onChange={(e) => {
                                setValidUntil(e.target.value);
                                setError(null); // Clear error on input change
                            }}
                             // Apply error styling if date is missing
                            isInvalid={!validUntil}
                        />
                        <Form.Control.Feedback type="invalid">
                            A valid date is required.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-center gap-3">
                <Button variant="secondary" onClick={onCancel} style={{ minWidth: "120px" }}>
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    style={{ minWidth: "120px" }}
                    disabled={isSaveDisabled} // Disable button if fields are incomplete/invalid
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GiftcardModal;