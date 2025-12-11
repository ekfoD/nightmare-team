import { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

import "../../styles/Superadmin.css";

const testingGround = false;
const ORGANIZATIONS_API = "https://localhost:7079/api/organizations/";

function Superadmin() {

    const [organizations, setOrganizations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newOrg, setNewOrg] = useState({
        name: "",
        organizationType: 0,
        address: "",
        emailAddress: "",
        phoneNumber: ""
    });

    useEffect(() => {
        fetchOrganizations()
    }, []);

    const fetchOrganizations = async () => {

        if (testingGround) {
            const mockData = [
                { name: "Org1", organizationId: "11111111-1111-1111-111111111111" },
                { name: "Org2", organizationId: "22222222-2222-2222-222222222222" },
                { name: "Org3", organizationId: "33333333-3333-3333-333333333333" },
            ]
            setOrganizations(mockData);
            return;
        }

        try {
            const response = await axios.get(ORGANIZATIONS_API);
            setOrganizations(response.data);
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleManage = (organization) => {
        console.log("Managing: " + organization.name);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrg(prev => ({ ...prev, [name]: value }));
    }

    const handleAddOrganization = async () => {
        console.log("Adding organization: ", newOrg);

        if (testingGround) {
            setOrganizations(prev => [...prev, { ...newOrg, organizationId: Date.now().toString() }]);
        }

        try {
            await axios.post(ORGANIZATIONS_API, newOrg);
            fetchOrganizations();
        } catch (e) {
            console.log(e.message);
        }

        setShowModal(false);
        setNewOrg({ name: "", organizationType: 0, address: "", emailAddress: "", phoneNumber: "" });
    }

    return (
        <Container className="p-2 d-flex flex-column gap-2 w-100 border rounded-4 bg-light">
            <Button className="p-2" onClick={() => setShowModal(true)}>
                Add New Organization
            </Button>

            <Table id="superadminTable" className="table-wrapper rounded-3 h-100 overflow-hidden" striped bordered>
                <thead>
                    <tr>
                        <th>Organization name</th>
                        <th>Organization GUID</th>
                        <th className="hidden"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        organizations.map((organization, idx) => (
                            <tr key={idx} className="h-100 hover-row">
                                <td>{organization.name}</td>
                                <td>{organization.organizationId}</td>
                                <td className="p-0 border-0 h-100 ">
                                    <Button
                                        className="border-0 w-100 h-100 rounded-0"
                                        onClick={() => handleManage(organization)}>
                                        Manage
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            {/* Modal for Adding New Organization */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Organization</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newOrg.name}
                                onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Organization Type</Form.Label>
                            <Form.Select
                                name="organizationType"
                                value={newOrg.organizationType} 
                                onChange={handleInputChange}    
                            >
                                <option value="">Select type...</option>
                                <option value="1">Order Based</option>
                                <option value="2">Service Based</option>
                                <option value="3">Order and Service Based</option>
                            </Form.Select>
                        </Form.Group>


                        <Form.Group className="mb-2">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={newOrg.address}
                                onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="emailAddress"
                                value={newOrg.emailAddress}
                                onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={newOrg.phoneNumber}
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddOrganization}>
                        Add Organization
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Superadmin;
