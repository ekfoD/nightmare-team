import '../../styles/Employees.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

//const EMPLOYEE_API = "api/employees/"
const EMPLOYEE_API = "https://localhost:7079/api/employees/"
const organizationId = "6a0c37bc-6245-492c-b1ec-108cfd6f8f66" // cia random guid

const StatusEnum = {
    active: 1,
    inactive: 2,
    unavailable: 3
};

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [access, setAccess] = useState(0);
    const [status, setStatus] = useState("Active");

    const isCreate = selectedEmployee === null;

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("https://localhost:7079/api/Employees/" + organizationId);
            setEmployees(response.data);
        } catch (e) {
            setErrMsg(e.response?.data?.message || e.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    function handleSelect(employee) {
        if (employee === null) {
            setSelectedEmployee(null);
            setUsername('');
            setStatus("Active");
            setPassword('');
            setAccess(0);
            return;
        }

        setUsername(employee.username);
        setAccess(employee.accessFlag);
        setStatus(employee.status);
        setSelectedEmployee(employee);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(EMPLOYEE_API + "add", {
                username,
                password,
                accessFlag: access,
                status,
                organizationId,
            });
            await fetchEmployees();
        } catch (error) {
            setErrMsg(error.response?.data?.message || error.message);
        }
    };


    const handleEdit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(EMPLOYEE_API + selectedEmployee.employeeId + "/edit",
                {
                    username,
                    password,
                    accessFlag: access,
                    status,
                    organizationId,
                });
            setPassword('');
            await fetchEmployees();
        } catch (error) {
            setErrMsg(error.response?.data?.message || error.message);
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(EMPLOYEE_API + selectedEmployee.employeeId + "/delete");

            handleSelect(null); // Just return the fields all to null if delete went well
            await fetchEmployees();

        } catch (error) {
            setErrMsg(error.response?.data?.message || error.message);
        }
    }



    const contents = employees === undefined
        ? <h2>Loading the page...</h2>
        : <div id="employeePageContent" className="d-flex p-4 m-0">
            <Container id="employeeGrid" className="me-auto mt-0 ml-0">
                <Row className="g-3">

                    {/* Create Employee Card */}
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card
                            className="text-center shadow-sm h-100"
                            onClick={() => handleSelect(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <Card.Body className="d-flex justify-content-center">
                                <Card.Title className="align-self-center">Create Employee</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Employee Cards */}
                    {employees.map(employee => (
                        <Col key={employee.employeeId} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                className="text-center shadow-sm h-100"
                                onClick={() => handleSelect(employee)}
                                style={{ cursor: "pointer" }}
                            >
                                <Card.Img
                                    variant="top"
                                    src="https://www.nicepng.com/png/full/277-2774775_potato-png-images-potato-png.png"
                                    style={{ width: "100%", height: "150px", objectFit: "contain" }}
                                />
                                <Card.Body>
                                    <Card.Title>{employee.username}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                </Row>
            </Container>

            <section id="employeeEditField">
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <div className="text-center mb-3">
                            <img
                                src="/Placeholder_view_vector.svg"
                                alt="employee placeholder"
                                style={{ width: "120px", opacity: 0.8 }}
                            />
                        </div>

                        <Form onSubmit={isCreate ? handleSubmit : handleEdit}>

                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>{isCreate ? "Password" : "New Password"}</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder={isCreate ? "" : "Leave blank to keep current password"}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="unavailable">Unavailable</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Access Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={access}
                                    onChange={e => setAccess(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Row className="mt-3">
                                <Col>
                                    <Button type="submit" variant={isCreate ? "primary" : "warning"} className="w-100">
                                        {isCreate ? "Create User" : "Save"}
                                    </Button>
                                </Col>

                                {!isCreate && (
                                    <Col>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            className="w-100"
                                            onClick={handleDelete}
                                        >
                                            FIRE
                                        </Button>
                                    </Col>
                                )}
                            </Row>

                        </Form>
                    </Card.Body>
                </Card>
            </section>
        </div>;

    return (
        <>
            <h3 className="w-50 mx-auto text-center text-warning">{errMsg}</h3>
            {contents}
        </>
    );

}

export default Employees;