import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import GiftcardModal from "./GiftcardModal";

const API_URL = "https://localhost:7079/api/Giftcard";
const ORGANIZATION_ID = "a685b0d3-d465-4b02-8d66-5315e84f6cba"; // fixed for now

const GiftcardManagement = () => {
    const [giftcards, setGiftcards] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedGiftcard, setSelectedGiftcard] = useState(null);

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        loadGiftcards();
    }, []);

    const loadGiftcards = async () => {
        try {
            const res = await axios.get(`${API_URL}/organization/${ORGANIZATION_ID}`);
            setGiftcards(res.data);
        } catch (err) {
            console.error("Failed to load giftcards", err);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ADD / EDIT
    // =========================
    const handleSave = async (card) => {
        try {
            if (card.id) {
                await axios.put(`${API_URL}/${card.id}`, {
                    balance: card.balance,
                    validUntil: card.validUntil
                });
            } else {
                await axios.post(`${API_URL}/organization/${ORGANIZATION_ID}`, {
                    balance: card.balance,
                    validUntil: card.validUntil
                });
            }

            await loadGiftcards();
            setShowModal(false);
        } catch (err) {
            console.error("Save failed", err);
            alert("Failed to save giftcard");
        }
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this giftcard?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            setGiftcards(giftcards.filter(g => g.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete giftcard");
        }
    };

    // =========================
    // UI
    // =========================
    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container fluid className="p-4" style={{ backgroundColor: "#aac2fdff", minHeight: "100vh" }}>
            <div className="d-flex flex-column align-items-center">

                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "1200px",
                    marginBottom: "30px"
                }}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Giftcard ID</th>
                                <th>Balance</th>
                                <th>Valid Until</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {giftcards.map(g => (
                                <tr key={g.id}>
                                    <td
                                        style={{
                                            fontFamily: "monospace",
                                            fontSize: "0.75rem",
                                            color: "#555",
                                            wordBreak: "break-all"
                                        }}
                                    >
                                        {g.id}
                                    </td>

                                    <td>{g.balance.toFixed(2)}</td>
                                    <td>{g.validUntil}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => {
                                                setSelectedGiftcard(g);
                                                setShowModal(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(g.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                        setSelectedGiftcard(null);
                        setShowModal(true);
                    }}
                >
                    Add Giftcard
                </Button>
            </div>

            <GiftcardModal
                show={showModal}
                giftcard={selectedGiftcard}
                onSave={handleSave}
                onCancel={() => setShowModal(false)}
            />
        </Container>
    );
};

export default GiftcardManagement;
