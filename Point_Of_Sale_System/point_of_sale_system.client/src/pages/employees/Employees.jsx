import '../../styles/Employees.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EMPLOYEE_API = "https://localhost:7079/api/employees/"
const organizationId = "a886c4f8-bbdb-4151-b1b6-679fbd5f4a2e" // cia random guid

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [access, setAccess] = useState(0);
    const [status, setStatus] = useState("Active");

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("https://localhost:7079/api/Employees/" + organizationId);
            // Make sure we always set an array
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            setErrMsg(e.response?.data?.message || e.message);
            setEmployees([]); // fallback
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

        setSelectedEmployee(employee);
        setUsername(employee.username);
        setAccess(employee.accessFlag);
        switch (employee.status) {
            case 1:
                setStatus("Active");
                break;
            case 2:
                setStatus("Inactive");
                break;
            default:
                setStatus("Unavailable");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(EMPLOYEE_API + "add", {
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
            const response = await axios.put(EMPLOYEE_API + selectedEmployee.id + "/edit",
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

    const handleDelete = async (employee) => {
        try {
            const response = await axios.delete(EMPLOYEE_API + selectedEmployee.id + "/delete");

            handleSelect(null); // Just return the fields all to null if delete went well
            await fetchEmployees();

        } catch (error) {
            setErrMsg(error.response?.data?.message || error.message);
        }
    }

    const contents = employees === undefined
        ? <h2>Loading the page...</h2>
        : <div id="employeePageContent">
            <section id="employeeGrid">
                <>
                    <div className="employeeBox" id="createEmployeeBox" onClick={() => {handleSelect(null)}}>
                        Create Employee
                    </div>
                {employees.map(function (employee) {
                    return (
                        <div
                            key={employee.id}
                            className="employeeBox"
                            onClick={() => { handleSelect(employee) }}
                        >
                            <img src="https://www.nicepng.com/png/full/277-2774775_potato-png-images-potato-png.png" />
                            {employee.username}
                        </div>
                    )
                })}
                </>
            </section>
            <section id="employeeEditField">
                {
                    selectedEmployee === null
                        ?
                        <form onSubmit={handleSubmit}>
                            <img src="../../public/Placeholder_view_vector.svg" />
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                            <label htmlFor="status">Set Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                            <label htmlFor="access">Access level:</label>
                            <input
                                type="number"
                                id="accessFlag"
                                onChange={(e) => setAccess(e.target.value)}
                                value={access}
                                required
                            />
                            <button>Create User</button>
                        </form>
                        :
                        <form onSubmit={handleEdit}>
                            <img src="../../public/Placeholder_view_vector.svg" />
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                            <label htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <label htmlFor="status">Set Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                            <label htmlFor="access">Access level:</label>
                            <input
                                type="number"
                                id="accessFlag"
                                onChange={(e) => setAccess(e.target.value)}
                                value={access}
                                required
                            />
                            <button type="submit">Edit</button>
                            <button type="button" onClick={() => handleDelete(selectedEmployee)}>FIRE</button>
                        </form>
                }
            </section>
        </div>;

    return (
        <>
            <h3>Employees</h3>
            <h3 className="w-50 mx-auto text-center text-warning">{errMsg}</h3>
            {contents}
        </>
    );

}

export default Employees;