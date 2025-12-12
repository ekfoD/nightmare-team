import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from 'react';

export default function EditOrganization({ onSubmit, business }) {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        emailAddress: "",
        phoneNumber: "",
        currencyType: 0
    });

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || "",
                address: business.address || "",
                emailAddress: business.emailAddress || "",
                phoneNumber: business.phoneNumber || "",
                currencyType: business.currencyType || 0,
            });
        }
    }, [business]);

    console.log("BUSINESS PROPS:", business);

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
            currencyType: business.currencyType || 0,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Setting change succesfull");
        onSubmit(formData);
    };

    return (
        <Card className="p-4 shadow-sm w-50">
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
                    <Form.Label>Organization email address</Form.Label>
                    <Form.Control
                        type="email"
                        value={formData.emailAddress}
                        name="emailAddress"
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

                <Form.Group className="mb-3 w-25" controlId="formCurrency">
                    <Form.Label>Choose currency</Form.Label>
                    <Form.Select
                        value={formData.currencyType}
                        name="currencyType"
                        onChange={handleChange}
                    >
                        <option value="1">USD - $</option>
                        <option value="2">EUR - €</option>
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