import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import GiftcardModal from "./GiftcardModal";

const GiftcardManagement = () => {

    const [giftcards, setGiftcards] = useState([
        {
            id: "1",
            balance: 50.00,
            currency: 2,
            validUntil: "2025-12-31",
        },
        {
            id: "2",
            balance: 100.00,
            currency: 1,
            validUntil: "2026-06-15",
        },
        {
            id: "3",
            balance: 25.00,
            currency: 1,
            validUntil: "2024-09-01",
        }
    ]);



    function formatCurrency(value) {
    switch (value) {
        case 1: return "€";
        case 2: return "$";
        default: return "";
    }
}

    const [showModal, setShowModal] = useState(false);
    const [selectedGiftcard, setSelectedGiftcard] = useState(null);

    const handleModify = (giftcard) => {
        setSelectedGiftcard(giftcard);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedGiftcard(null);
        setShowModal(true);
    };

    const handleSave = (updatedCard) => {
        if (updatedCard.id) {
            setGiftcards(giftcards.map(g => (g.id === updatedCard.id ? updatedCard : g)));
        } else {
            updatedCard.id = crypto.randomUUID();
            setGiftcards([...giftcards, updatedCard]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setGiftcards(giftcards.filter(g => g.id !== id));
    };

    return (
        <Container fluid className="p-4" style={{ backgroundColor: '#aac2fdff', minHeight: '100vh' }}>
            <div className="d-flex flex-column align-items-center" style={{ height: 'calc(100vh - 100px)' }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '1200px',
                    marginBottom: '30px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 200px)'
                }}>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <Table hover style={{ marginBottom: 0 }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Balance</th>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Currency</th>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Valid Until</th>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {giftcards.map((g, index) => (
                                    <tr key={g.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#e9ecef' }}>
                                        <td style={{ padding: '15px', color: '#666' }}>{g.balance.toFixed(2)}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>{formatCurrency(g.currency)}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>{g.validUntil}</td>
                                        <td style={{ padding: '15px' }}>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button size="sm" variant="warning" onClick={() => handleModify(g)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(g.id)}>
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
                        borderRadius: '8px',
                        border: '2px solid #0d6efd',
                        fontWeight: '500',
                        padding: '12px 50px',
                        minWidth: '200px'
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
