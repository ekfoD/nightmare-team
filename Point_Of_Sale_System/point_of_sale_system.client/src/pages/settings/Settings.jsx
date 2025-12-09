import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { useState } from "react";
import EditAccount from "./EditAccount";
import EditOrganization from "./EditOrganization";

function Settings() {
    const [activeTab, setActiveTab] = useState("organization");

    const bussines = {
        name: "VACKACKA INDUSTRY",
        address: "Lithuania Kaunas Vilniaus g. 15",
        emailAddress: "danieliukas67@gmail.com",
        phoneNumber: "+37012345678",
        bussinesType: "service",
        currency: "€",
    };

    function handleFormSubmit(updatedData) {
        console.log("Updated business:", updatedData);
    }

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={3}>
                    <Card className="shadow-sm">
                        <ListGroup variant="flush">
                            <ListGroup.Item
                                action
                                active={activeTab === "organization"}
                                onClick={() => setActiveTab("organization")}
                            >
                                Organization
                            </ListGroup.Item>

                            <ListGroup.Item
                                action
                                active={activeTab === "profile"}
                                onClick={() => setActiveTab("profile")}
                            >
                                Profile
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={9}>
                    {activeTab === "organization" && (
                        <EditOrganization
                            business={bussines}
                            onSubmit={handleFormSubmit}
                        />
                    )}

                    {activeTab === "profile" && (
                        <EditAccount username="test" />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Settings;
