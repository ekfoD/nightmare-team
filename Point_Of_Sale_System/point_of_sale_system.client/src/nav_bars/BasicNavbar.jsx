import { useNavigate, NavLink } from "react-router-dom";
import "./BasicNavbar.css";

function BasicNavbar() {

    return (
        <div className={"navContainer"}>
            {/*<h2>POS Application</h2>*/}
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
            <NavLink className="logOutButton" to="/logout" end>
                <img className="logOutImage" src="../../public/logout.png" width="20px"></img>
            </NavLink>
        </div>
    );
}

export default BasicNavbar;