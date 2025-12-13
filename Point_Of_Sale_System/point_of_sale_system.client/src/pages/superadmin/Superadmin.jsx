import { useEffect, useState, useRef } from 'react';
import { Table, Container, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

import "../../styles/Superadmin.css";

const ORGANIZATIONS_API = "https://localhost:7079/api/Organizations/";

function Superadmin() {
    const [organizations, setOrganizations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newOrg, setNewOrg] = useState({
        name: "",
        organizationType: 0,
        address: "",
        emailAddress: "",
        phoneNumber: "",
        currencyType: 0
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const formRef = useRef(null);

    useEffect(() => {
        fetchOrganizations(currentPage);
    }, [currentPage]);

    const handleSubmit = () => {
        if (formRef.current.checkValidity()) {
            handleAddOrganization();
        } else {
            formRef.current.reportValidity();
        }
    };

    const fetchOrganizations = async (page = 1) => {
        try {
            const response = await axios.get(`${ORGANIZATIONS_API}?pageNumber=${page}&pageSize=10`);
            const data = response.data;

            setOrganizations(data.items);
            setCurrentPage(data.currentPage); // backend is 1-indexed
            setTotalPages(data.totalPages);
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleManage = (organization) => {
        console.log("Managing: " + organization.name);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrg(prev => ({ ...prev, [name]: value }));
    };

    const validateNewOrg = (org) => {
        if (!org.name || org.name.trim() === "") return false;
        if (![1, 2, 3].includes(Number(org.organizationType))) return false;
        if (!org.address || org.address.trim() === "") return false;
        if (!org.phoneNumber || org.phoneNumber.trim() === "") return false;
        if (![1, 2].includes(Number(org.currencyType))) return false;

        return true;
    };

    const handleAddOrganization = async () => {
        if (!validateNewOrg(newOrg)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        try {
            await axios.post(ORGANIZATIONS_API, newOrg);
            fetchOrganizations(currentPage);
        } catch (e) {
            console.log(e.message);
        }

        setShowModal(false);
        setNewOrg({ name: "", organizationType: 0, address: "", emailAddress: "", phoneNumber: "", currencyType: 0 });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => (
        <Pagination>
            <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            />
            <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
            />
            <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
            />
        </Pagination>
    );

    return (
        <Container className="p-2 d-flex flex-column gap-2 w-100 border rounded-4 bg-light">
            <Button className="p-2 mb-2" onClick={() => setShowModal(true)}>
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
                    {organizations.map((organization, idx) => (
                        <tr key={idx} className="h-100 hover-row">
                            <td>{organization.name}</td>
                            <td>{organization.organizationId}</td>
                            <td className="p-0 border-0 h-100">
                                <Button
                                    className="border-0 w-100 h-100 rounded-0"
                                    onClick={() => handleManage(organization)}
                                >
                                    Manage
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalPages > 1 && renderPagination()}

            {/* Modal for Adding New Organization */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Organization</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newOrg.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Organization Type</Form.Label>
                            <Form.Select
                                name="organizationType"
                                value={newOrg.organizationType}
                                onChange={handleInputChange}
                                required
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
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="emailAddress"
                                value={newOrg.emailAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={newOrg.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Currency Type</Form.Label>
                            <Form.Select
                                name="currencyType"
                                value={newOrg.currencyType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Type...</option>
                                <option value="1">Euro</option>
                                <option value="2">Dollar</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                    >
                        Add Organization
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Superadmin;
