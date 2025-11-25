import './Employees.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
const EMPLOYEE_API = "api/employees/35a03460-3e70-4aa3-af3e-fb5fac17e0df"
const wtf = "https://localhost:7079/api/employees/35a03460-3e70-4aa3-af3e-fb5fac17e0df"
const organizationId = "35a03460-3e70-4aa3-af3e-fb5fac17e0df"
function Employees() {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [errMsg, setErrMsg] = useState('');

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("https://localhost:7079/api/Employees/" + organizationId);
            //console.log("SHEESH:"+EMPLOYEE_API + "35a03460-3e70-4aa3-af3e-fb5fac17e0df")
            setEmployees(response.data);
        } catch (e) {
            setErrMsg(e.response?.data?.message || e.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    function handleSelect(employee) {
        setSelectedEmployee(employee);
        console.log(employee.username);
    }

    const contents = employees === undefined
        ? <h2>Loading the page...</h2>
        : <div id="employeePageContent">
            <section id="employeeGrid">
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
            </section>
            <section id="employeeEditField">
                {
                    selectedEmployee === null
                        ?
                        <>
                            <img src="../../public/Placeholder_view_vector.svg" />
                            <h4>Temporary field on null</h4>
                            <h4>Temporary field on null</h4>
                        </>
                        :
                        <>
                            <img src="https://www.nicepng.com/png/full/277-2774775_potato-png-images-potato-png.png" />
                            <h4>{selectedEmployee.id}</h4>
                            <h4>{selectedEmployee.username}</h4>
                        </>
                }
            </section>
        </div>;

    return (
        <>
            <h3>Employees</h3>
            <h3 className="hidden">{errMsg}</h3>
            {contents}
        </>
    );

}

export default Employees;