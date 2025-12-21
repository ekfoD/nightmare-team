import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { hasAccess } from "../../utilities/permissions.js";
import { ROLES, BUSINESS_TYPES } from "../../config/access.js";

function Navbar() {
  const { auth, setAuth } = useAuth();
  const role = auth?.role;
  const businessType = auth?.businessType;
  const businessId = auth?.businessId;

  const canSee = (minRole, allowedBusiness) =>
    hasAccess({
      userRole: role,
      businessType,
      businessId,
      minRole,
      allowedBusiness,
      requireBusiness: true,
    });

  const logout = () => {
    setAuth({});       // clear auth state
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

            {/* admin + CAN SEE THIS ALWAYS */}
            {canSee(ROLES.ADMIN) && (
              <Nav.Link as={NavLink} to="/superadmin">
                Superadmin
              </Nav.Link>
            )}

            {/* pages stay hidden until admin selects a business */}
            {businessId && (
              <>
                {canSee(ROLES.OWNER) && (
                  <>
                    <Nav.Link as={NavLink} to="/management">Management</Nav.Link>
                  </>
                )}

                {/* manager (common) */}
                {canSee(ROLES.MANAGER, [BUSINESS_TYPES.ORDER, BUSINESS_TYPES.SERVICE]) && (
                  <>
                    <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                    <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>
                    <Nav.Link as={NavLink} to="/discounts">Discounts</Nav.Link>
                  </>
                )}

                {/* manager ORDER */}
                {canSee(ROLES.MANAGER, [BUSINESS_TYPES.ORDER]) && (
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

                {/* employee ORDER */}
                {canSee(ROLES.EMPLOYEE, [BUSINESS_TYPES.ORDER]) && (
                  <>
                    <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
                  </>
                )}

                {/* employee service-only */}
                {canSee(ROLES.EMPLOYEE, [BUSINESS_TYPES.SERVICE]) && (
                  <>
                    <Nav.Link as={NavLink} to="/appointmentPayment">Payment</Nav.Link>
                    <Nav.Link as={NavLink} to="/schedule">Schedule</Nav.Link>
                  </>
                )}

                {/* logout */}
                {role && (
                  <Nav.Link onClick={logout}>
                    Logout
                  </Nav.Link>
                )}
              </>
            )}

          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
