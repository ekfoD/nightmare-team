import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function Navbar() {
  const { auth } = useAuth();
  const roles = auth?.user?.roles || [];

  // Helper to check if user has at least a given role
  const hasRole = (role) => {
    const hierarchy = ['employee', 'manager', 'owner', 'admin'];
    const userMax = Math.max(...roles.map(r => hierarchy.indexOf(r.toLowerCase())));
    const required = hierarchy.indexOf(role);
    return userMax >= required && userMax !== -Infinity && required !== -1;
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/">MyApp</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Admin only */}
            {hasRole('admin') && <Nav.Link as={NavLink} to="/superadmin">Superadmin</Nav.Link>}
            {/* Manager and up */}
            {hasRole('manager') && <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>}
            {hasRole('manager') && <Nav.Link as={NavLink} to="/inventory">Inventory</Nav.Link>}
            {hasRole('manager') && <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>}
            {hasRole('manager') && <Nav.Link as={NavLink} to="/menuManagement">Menu Management</Nav.Link>}
            {/* Employee and up */}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/" end>About</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/orderHistory">Order History</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/services">Services</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/schedule">Schedule</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/appAbout">App About</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/appHistory">App History</Nav.Link>}
            {hasRole('employee') && <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>}
            {/* Show role info */}
            {roles.length > 0 && (
              <span style={{ color: 'white', marginLeft: '1rem' }}>
                Role: {roles.join(', ')}
              </span>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
