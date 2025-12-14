import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const GiftcardModal = ({ show, giftcard, onSave, onCancel }) => {
    const [balance, setBalance] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            if (giftcard) {
                setBalance(String(giftcard.balance));
                setValidUntil(giftcard.validUntil);
            } else {
                setBalance("");
                setValidUntil("");
            }
            setError(null);
        }
    }, [giftcard, show]);

    const handleSubmit = () => {
        const numericBalance = parseFloat(balance);

        if (isNaN(numericBalance) || numericBalance <= 0) {
            setError("Balance must be greater than zero.");
            return;
        }

        if (!validUntil) {
            setError("Valid until date is required.");
            return;
        }

        onSave({
            id: giftcard?.id,
            balance: numericBalance,
            validUntil
        });
    };

    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{giftcard ? "Edit Giftcard" : "Add Giftcard"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                            type="number"
                            min="0.01"
                            value={balance}
                            onChange={e => setBalance(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Valid Until</Form.Label>
                        <Form.Control
                            type="date"
                            value={validUntil}
                            onChange={e => setValidUntil(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GiftcardModal;
