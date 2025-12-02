import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

// export default function EditForm({ business, OnSave, OnCancel }) {

export default function EditForm({ }) {
    // const [formData, setFormData] = useState({
    //     name: business.name || "",
    //     address: business.address || "",
    //     emailAddress: business.emailAddress || "",
    //     phoneNumber: business.phoneNumber || "",
    //     bussinesType: business.bussinesType || "",
    //     currency: business.currency || "",
    // });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     OnSave(formData);   // send data back to parent
    // };
    return (
        <Card className="p-4 shadow-sm">
            <h3 className="mb-3">Organization settings</h3>
            <Form>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Organization name</Form.Label>
                    <Form.Control type="string" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Organization address</Form.Label>
                    <Form.Control type="string" />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Organization phone number</Form.Label>
                    <Form.Control type="phone" pattern="[0-9]{3}" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formOrganizationType">
                    <Form.Label>Choose </Form.Label>
                    <Form.Select >
                        <option>Select any value</option>
                        <option>Order</option>
                        <option>Service</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCurrency">
                    <Form.Label>Choose currency</Form.Label>
                    <Form.Select>
                        <option>Select any value</option>
                        <option>$</option>
                        <option>€</option></Form.Select>
                </Form.Group>

            </Form>
        </Card>
    );
}