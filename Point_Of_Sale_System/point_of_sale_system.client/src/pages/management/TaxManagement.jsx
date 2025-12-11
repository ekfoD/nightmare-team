import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import TaxModal from "./TaxModal";

const TaxManagement = () => {

    const [taxes, setTaxes] = useState([
        {
            id: "1",
            name: "VAT",
            amount: 15.0,
            numberType: "Percentage",   // flat or percentage
            status: 1                   // 1 = active, 2 = inactive, 3 = unavailable
        },
        {
            id: "2",
            name: "Service Tax",
            amount: 5.00,
            numberType: "Flat",
            status: 2
        },
        {
            id: "3",
            name: "Luxury Tax",
            amount: 20.0,
            numberType: "Percentage",
            status: 1
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedTax, setSelectedTax] = useState(null);

    const handleAdd = () => {
        setSelectedTax(null);
        setShowModal(true);
    };

    const handleEdit = (tax) => {
        setSelectedTax(tax);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setTaxes(taxes.filter(t => t.id !== id));
    };

    const handleSave = (updatedTax) => {
        if (updatedTax.id) {
            // update
            setTaxes(taxes.map(t => (t.id === updatedTax.id ? updatedTax : t)));
        } else {
            // create
            updatedTax.id = crypto.randomUUID();
            setTaxes([...taxes, updatedTax]);
        }
        setShowModal(false);
    };

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
                        <Table hover style={{ marginBottom: 0 }}>
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                                <tr style={{ backgroundColor: "#f8f9fa" }}>
                                    <th style={{ border: "2px solid #333", padding: "15px" }}>Name</th>
                                    <th style={{ border: "2px solid #333", padding: "15px" }}>Amount</th>
                                    <th style={{ border: "2px solid #333", padding: "15px" }}>Number Type</th>
                                    <th style={{ border: "2px solid #333", padding: "15px" }}>Status</th>
                                    <th style={{ border: "2px solid #333", padding: "15px" }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {taxes.map((t, index) => (
                                    <tr key={t.id} style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#e9ecef" }}>
                                        <td style={{ padding: "15px", color: "#666" }}>{t.name}</td>
                                        <td style={{ padding: "15px", color: "#666" }}>{t.amount}</td>
                                        <td style={{ padding: "15px", color: "#666" }}>{t.numberType}</td>
                                        <td style={{ padding: "15px", color: "#666" }}>
                                            {t.status === 1 ? "Active" : t.status === 2 ? "Inactive" : "Unavailable"}
                                        </td>

                                        <td style={{ padding: "15px" }}>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button size="sm" variant="warning" onClick={() => handleEdit(t)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAdd}
                    style={{
                        borderRadius: "8px",
                        border: "2px solid #0d6efd",
                        fontWeight: "500",
                        padding: "12px 50px",
                        minWidth: "200px"
                    }}>
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
