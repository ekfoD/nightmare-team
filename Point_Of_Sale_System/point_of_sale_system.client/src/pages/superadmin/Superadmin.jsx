import { useEffect, useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import axios from 'axios';

import "../../styles/Superadmin.css";


const testingGround = true;

const ORGANIZATIONS_API = "https://localhost:7079/api/organizations/";
function Superadmin() {

    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        fetchOrganizations()
    }, []);

    const fetchOrganizations = async () => {

        if (testingGround) {
            const mockData = [
                {
                    name: "Org1",
                    organizationId: "11111111-1111-1111-111111111111"
                },
                {
                    name: "Org2",
                    organizationId: "22222222-2222-2222-222222222222"
                },
                {
                    name: "Org3",
                    organizationId: "33333333-3333-3333-333333333333"
                },
            ]

            setOrganizations(mockData);
            return;
        }

        try {
            const response = await axios.get(ORGANIZATIONS_API);
            setOrganizations(response.data);
        }
        catch (e) {
            console.log(e.message);
        }

    };

    const handleManage = async (organization) => {
        console.log("Managing: " + organization.name);
    }

    return (
        <Container className="p-2 w-100 border rounded-4 bg-light">
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
                        organizations.map((organization) => {
                            return (
                                <tr className="h-100 hover-row">
                                    <td>{organization.name}</td>
                                    <td>{organization.organizationId}</td>
                                    <td className="p-0 border-0 h-100 ">
                                        <Button
                                            className="border-0 w-100 h-100 rounded-0"
                                            onClick={() => { handleManage(organization) }}>
                                                Manage
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </Container>
    );
}

export default Superadmin;