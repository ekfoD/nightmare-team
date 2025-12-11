import React, { useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import TaxManagement from './TaxManagement';
import GiftcardManagement from "./GiftcardManagement";

const Management = () => {

    const currencyOptions = [
        { value: 1, label: "Euro (€)" },
        { value: 2, label: "Dollar ($)" }
    ];

    const [activeTab, setActiveTab] = useState("organization");

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={3}>
                    <Card className="shadow-sm">
                        <ListGroup variant="flush">
                            <ListGroup.Item
                                action
                                active={activeTab === "tax"}
                                onClick={() => setActiveTab("tax")}
                            >
                                Taxes
                            </ListGroup.Item>

                            <ListGroup.Item
                                action
                                active={activeTab === "giftcard"}
                                onClick={() => setActiveTab("giftcard")}
                            >
                                Giftcards
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={9}>
                    {activeTab === "tax" && (
                        <TaxManagement />
                    )}

                    {activeTab === "giftcard" && (
                        <GiftcardManagement />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Management;
