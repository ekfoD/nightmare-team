import { useNavigate, NavLink } from "react-router-dom";
import "./BasicNavbar.css";

function BasicNavbar() {

    return (
        <div className={"navContainer"}>
            <h2>POS Application</h2>
            <nav>
                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/Orders" end>
                    Orders
                </NavLink>

                <NavLink to="/Inventory" end>
                    Inventory
                </NavLink>

                <NavLink to="/Employees" end>
                    Employees
                </NavLink>
            </nav>
            <NavLink to="/logout" end>
                <img src="../../public/logout.png" width="20px"></img>
            </NavLink>
        </div>
    );
}

export default BasicNavbar;