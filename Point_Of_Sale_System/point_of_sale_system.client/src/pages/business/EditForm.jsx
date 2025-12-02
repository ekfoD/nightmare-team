import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function EditForm({ business, OnSave, OnCancel }) {
    const [formData, setFormData] = useState({
        name: business.name || "",
        address: business.address || "",
        emailAddress: business.emailAddress || "",
        phoneNumber: business.phoneNumber || "",
        bussinesType: business.bussinesType || "",
        currency: business.currency || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        OnSave(formData);   // send data back to parent
    };
    return (
        <Card className="p-4 shadow-sm">
            <h3 className="mb-3">Edit Employee Info</h3>
            <Form onSubmit={handleSubmit}>
                <Col md={6}></Col>

            </Form>
        </Card>
    );
}