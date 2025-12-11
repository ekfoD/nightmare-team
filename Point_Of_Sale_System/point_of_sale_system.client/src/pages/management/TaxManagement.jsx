import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import TaxModal from "./TaxModal";

const TaxManagement = () => {

    // --- Example Data (replace this with backend API later) ---
    const [taxes, setTaxes] = useState([
        {
            id: "1",
            name: "VAT",
            amount: 15,
            numberType: 2,         // percentage
            status: 1              // active
        },
        {
            id: "2",
            name: "Service Fee",
            amount: 5,
            numberType: 1,         // flat
            status: 2              // inactive
        },
        {
            id: "3",
            name: "Luxury Tax",
            amount: 30,
            numberType: 2,
            status: 3              // unavailable
        },
        {
            id: "4",
            name: "Luxury Tax",
            amount: 30,
            numberType: 2,
            status: 3              // unavailable
        },
        {
            id: "5",
            name: "Luxury Tax",
            amount: 30,
            numberType: 2,
            status: 3              // unavailable
        },
        {
            id: "6",
            name: "Luxury Tax",
            amount: 30,
            numberType: 2,
            status: 3              // unavailable
        }
    ]);

    function formatNumberType(type) {
        switch (type) {
            case 1: return "Flat";
            case 2: return "%";
            default: return "Unknown";
        }
    }

    function formatStatus(status) {
        switch (status) {
            case 1: return "Active";
            case 2: return "Inactive";
            case 3: return "Unavailable";
            default: return "Unknown";
        }
    }

    const handleModify = () => {
        alert("Modify modal will open here.");
    };

    return (
        <Container fluid className="p-4" style={{ backgroundColor: '#aac2fdff', minHeight: '100vh' }}>
            <div className="d-flex flex-column align-items-center" style={{ height: 'calc(100vh - 100px)' }}>

                {/* TABLE CARD */}
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
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Tax Name</th>
                                    <th style={{ border: '2px solid #333', padding: '15px', textAlign: 'right' }}>Amount</th>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Type</th>
                                    <th style={{ border: '2px solid #333', padding: '15px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxes.map((tax, index) => (
                                    <tr key={tax.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#e9ecef' }}>
                                        <td style={{ padding: '15px', color: '#666' }}>{tax.name}</td>
                                        <td style={{ padding: '15px', textAlign: 'right', color: '#666' }}>{tax.amount}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>{formatNumberType(tax.numberType)}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>{formatStatus(tax.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                {/* MODIFY BUTTON */}
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleModify}
                    style={{
                        borderRadius: '8px',
                        border: '2px solid #0d6efd',
                        fontWeight: '500',
                        padding: '12px 50px',
                        minWidth: '200px',
                    }}
                >
                    Modify
                </Button>
            </div>
        </Container>
    );
};

export default TaxManagement;
