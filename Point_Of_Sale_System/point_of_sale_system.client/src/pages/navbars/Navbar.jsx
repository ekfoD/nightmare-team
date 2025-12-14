import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const roleHierarchy = ["employee", "manager", "owner", "admin"];

function Navbar() {
  const { auth } = useAuth();
  const role = auth?.role;

  const hasRole = (requiredRole) => {
    if (!role) return false;

    const userLevel = roleHierarchy.indexOf(role.toLowerCase());
    const requiredLevel = roleHierarchy.indexOf(requiredRole);

    if (userLevel === -1 || requiredLevel === -1) return false;

    return userLevel >= requiredLevel;
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/">
          MyApp
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            {/* admin */}
            {hasRole("admin") && (
              <Nav.Link as={NavLink} to="/superadmin">
                Superadmin
              </Nav.Link>
            )}

            {/* manager */}
            {hasRole("manager") && (
              <>
                <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                <Nav.Link as={NavLink} to="/inventory">Inventory</Nav.Link>
                <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>
                <Nav.Link as={NavLink} to="/menuManagement">Menu Management</Nav.Link>
              </>
            )}

            {/* employee */}
            {hasRole("employee") && (
              <>
                <Nav.Link as={NavLink} to="/" end>About</Nav.Link>
                <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
                <Nav.Link as={NavLink} to="/orderHistory">Order History</Nav.Link>
                <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
                <Nav.Link as={NavLink} to="/schedule">Schedule</Nav.Link>
                <Nav.Link as={NavLink} to="/appHistory">App History</Nav.Link>
              </>
            )}

            {/* role display */}
            {role && (
              <span style={{ color: "white", marginLeft: "1rem" }}>
                Role: {role}
              </span>
            )}

          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
