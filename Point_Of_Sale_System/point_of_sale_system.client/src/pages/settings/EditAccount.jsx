import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function EditAccount(username) {
   function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    return (
        <Card className="p-4 shadow-sm w-50 ">
            <h3 className="mb-3">Change username</h3>
            <Form>
                <Form.Group className="mb-3 w-50" controlId="formName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="string"
                        value={username}
                        name="name"
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>

                    <Button variant="secondary">
                        Cancel
                    </Button>
                </div>
            </Form>

            <h3 className="mb-3">Change Password</h3>
            <Form>
                <Form.Group className="mb-3 w-50" controlId="formName">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="name"
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="formName">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="name"
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="formName">
                    <Form.Label>Repeat New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="name"
                    />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="primary" type="submit" >
                        Update Password
                    </Button>
                </div>
            </Form>

        </Card>
    );
}