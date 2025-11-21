import { useNavigate, NavLink } from "react-router-dom";
import "./BasicNavbar.css";

function BasicNavbar() {

    return (
        <nav>
            <NavLink to="/" end>
                Home
            </NavLink>

            <NavLink to="/MenuManagement" end>
                Orders
            </NavLink>

            <NavLink to="/Inventory" end>
                Inventory
            </NavLink>

            <NavLink to="/Employees" end>
                Employees
            </NavLink>
        </nav>
    );
}

export default BasicNavbar;