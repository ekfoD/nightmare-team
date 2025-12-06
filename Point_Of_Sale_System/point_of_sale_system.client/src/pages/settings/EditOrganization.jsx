import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function EditOrganization({ onSubmit, business }) {
    const [formData, setFormData] = useState({
        name: business.name || "",
        address: business.address || "",
        emailAddress: business.emailAddress || "",
        phoneNumber: business.phoneNumber || "",
        bussinesType: business.bussinesType || "",
        currency: business.currency || "",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        setFormData({
            name: business.name || "",
            address: business.address || "",
            emailAddress: business.emailAddress || "",
            phoneNumber: business.phoneNumber || "",
            bussinesType: business.bussinesType || "",
            currency: business.currency || "",
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        onSubmit(formData);
    };

    return (
        <Card className="p-4 shadow-sm w-50 ">
            <h3 className="mb-3">Organization settings</h3>
            <Form>
                <Form.Group className="mb-3 w-50" controlId="formName">
                    <Form.Label>Organization name</Form.Label>
                    <Form.Control
                        type="string"
                        value={formData.name}
                        name="name"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="formAddress">
                    <Form.Label>Organization address</Form.Label>
                    <Form.Control
                        type="string"
                        value={formData.address}
                        name="address"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="formPhone">
                    <Form.Label>Organization phone number</Form.Label>
                    <Form.Control
                        type="phone"
                        pattern="\+\d{11}"
                        value={formData.phoneNumber}
                        name="phoneNumber"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-25" controlId="formOrganizationType">
                    <Form.Label>Choose organization type</Form.Label>
                    <Form.Select
                        value={formData.type}
                        name="type"
                        onChange={handleChange}
                    >
                        <option value="order">Order</option>
                        <option value="service">Service</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 w-25" controlId="formCurrency">
                    <Form.Label>Choose currency</Form.Label>
                    <Form.Select
                        value={formData.currency}
                        name="currency"
                        onChange={handleChange}
                    >
                        <option value="$">USD - $</option>
                        <option value="€">EUR - €</option>
                    </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>

                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Card>
    );
}