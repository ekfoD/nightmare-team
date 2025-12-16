import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Table } from "react-bootstrap";
import TaxModal from './TaxModal'
import useAuth from "../../hooks/useAuth";
import api from '../../api/axios.js';
const TaxManagement = () => {

    const { auth } = useAuth();
    const organizationId = auth.businessId;

    const NUMBER_TYPE = {
        FLAT: 1,
        PERCENTAGE: 2
    };

    const NUMBER_TYPE_LABEL = {
        1: "Flat",
        2: "Percentage"
    };

    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTax, setSelectedTax] = useState(null);
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://localhost:7079/api";

    // -----------------------------
    // LOAD TAXES
    // -----------------------------
    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const response = await api.get(
                    `/Tax/Organization/${organizationId}`
                );

                setTaxes(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load taxes.");
            } finally {
                setLoading(false);
            }
        };

        fetchTaxes();
    }, [organizationId]);


    const loadTaxes = async () => {
        try {
            const res = await api.get(
                `${API_BASE_URL}/Tax/Organization/${organizationId}`
            );
            setTaxes(res.data);
        } catch (err) {
            console.error("Failed to load taxes", err);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // ADD
    // -----------------------------
    const handleAdd = () => {
        setSelectedTax(null);
        setShowModal(true);
    };

    // -----------------------------
    // EDIT
    // -----------------------------
    const handleEdit = (tax) => {
        setSelectedTax(tax);
        setShowModal(true);
    };

    // -----------------------------
    // DELETE
    // -----------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this tax?")) return;

        try {
            await api.delete(`${API_BASE_URL}/Tax/${id}`);
            setTaxes(taxes.filter(t => t.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    // -----------------------------
    // SAVE (CREATE / UPDATE)
    // -----------------------------
    const handleSave = async (tax) => {
        try {
            if (tax.id) {
                // UPDATE
                const res = await api.put(
                    `${API_BASE_URL}/Tax/${tax.id}`,
                    tax
                );

                setTaxes(taxes.map(t => t.id === tax.id ? res.data : t));
            } else {
                // CREATE
                const res = await api.post(
                    `${API_BASE_URL}/Tax/organization/${organizationId}`,
                    tax
                );

                setTaxes([...taxes, res.data]);
            }

            setShowModal(false);
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    // -----------------------------
    // RENDER
    // -----------------------------
    if (loading) {
        return (
            <Container
                fluid
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh", backgroundColor: "#aac2fdff" }}
            >
                <h4>Loading taxes...</h4>
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                fluid
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh", backgroundColor: "#aac2fdff" }}
            >
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4" style={{ backgroundColor: "#aac2fdff", minHeight: "100vh" }}>
            <div className="d-flex flex-column align-items-center" style={{ height: "calc(100vh - 100px)" }}>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "100%",
                        maxWidth: "1200px",
                        marginBottom: "30px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "calc(100vh - 200px)"
                    }}>

                    <div style={{ overflowY: "auto", flex: 1 }}>
                        {loading ? (
                            <div className="text-center p-5">Loading taxes...</div>
                        ) : (
                            <Table hover style={{ marginBottom: 0 }}>
                                <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Number Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxes.map((t, index) => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td>{t.amount}</td>
                                            <td>{t.numberType === 1 ? "Flat" : "Percentage"}</td>
                                            <td>
                                                {t.status === 1 ? "Active" :
                                                    t.status === 2 ? "Inactive" : "Unavailable"}
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => handleEdit(t)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAdd}
                    style={{ minWidth: "200px" }}
                >
                    Add Tax
                </Button>
            </div>

            <TaxModal
                show={showModal}
                tax={selectedTax}
                onSave={handleSave}
                onCancel={() => setShowModal(false)}
            />
        </Container>
    );
};

export default TaxManagement;
