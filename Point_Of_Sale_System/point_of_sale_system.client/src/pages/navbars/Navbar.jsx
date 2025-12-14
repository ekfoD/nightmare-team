import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { hasAccess } from "../../utilities/permissions.js";
import { ROLES, BUSINESS_TYPES } from "../../config/access.js";

function Navbar() {
  const { auth } = useAuth();
  const role = auth?.role;
  const businessType = auth?.businessType;

  const canSee = (minRole, allowedBusiness) =>
    hasAccess({
      userRole: role,
      businessType,
      minRole,
      allowedBusiness,
    });

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
            {canSee(ROLES.ADMIN, [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]) && (
              <Nav.Link as={NavLink} to="/superadmin">
                Superadmin
              </Nav.Link>
            )}

            {/* manager (common) */}
            {canSee(ROLES.MANAGER, [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]) && (
              <>
                <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>
              </>
            )}

            {/* manager restaurant */}
            {canSee(ROLES.MANAGER, [BUSINESS_TYPES.RESTAURANT]) && (
              <>
                <Nav.Link as={NavLink} to="/inventory">Inventory</Nav.Link>
                <Nav.Link as={NavLink} to="/menuManagement">Menu Management</Nav.Link>
                <Nav.Link as={NavLink} to="/orderHistory">History</Nav.Link>
              </>
            )}

            {/* manager service */}
            {canSee(ROLES.MANAGER, [BUSINESS_TYPES.SERVICE]) && (
              <>
                <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
                <Nav.Link as={NavLink} to="/appHistory">History</Nav.Link>
              </>
            )}

            {/* employee common */}
            {canSee(ROLES.EMPLOYEE, [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]) && (
              <>
                <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
              </>
            )}

            {/* employee service-only */}
            {canSee(ROLES.EMPLOYEE, [BUSINESS_TYPES.SERVICE]) && (
              <>
                <Nav.Link as={NavLink} to="/schedule">Schedule</Nav.Link>
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
