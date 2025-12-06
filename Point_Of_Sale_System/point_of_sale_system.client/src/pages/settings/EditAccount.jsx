import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function EditAccount({ username }) {
    const [formData, setFormData] = useState({
        username: username || "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handlePasswordChange(e) {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    }

    function handleUsernameSubmit(e) {
        e.preventDefault();
        console.log("Updated username:", formData.username);

        // TODO: send to backend

        alert("Username updated!");
    }

    function handleUsernameCancel() {
        setFormData({ username });
    }

    function handlePasswordSubmit(e) {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.repeatNewPassword) {
            alert("New passwords do not match.");
            return;
        }

        console.log("Password update request:", passwordData);

        // TODO: send to backend securely

        alert("Password updated!");
    }

    return (
        <Card className="p-4 shadow-sm w-75">
            <h3 className="mb-3">Change Username</h3>

            <Form onSubmit={handleUsernameSubmit}>
                <Form.Group className="mb-3 w-50" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.username}
                        name="username"
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>

                    <Button variant="secondary" type="button" onClick={handleUsernameCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>

            <hr className="my-4" />

            <h3 className="mb-3">Change Password</h3>

            <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3 w-50" controlId="oldPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="repeatNewPassword">
                    <Form.Label>Repeat New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="repeatNewPassword"
                        value={passwordData.repeatNewPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="primary" type="submit">
                        Update Password
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
