import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { BsFillGearFill } from "react-icons/bs";

function Navbar() {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/"> MyApp </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/superadmin">Superadmin</Nav.Link>
            <Nav.Link as={NavLink} to="/orderHistory" end>History</Nav.Link>
            <Nav.Link as={NavLink} to="/menu" end>Menu</Nav.Link>
            <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
            <Nav.Link as={NavLink} to="/inventory">Inventory</Nav.Link>
            <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
            <Nav.Link as={NavLink} to="/appAbout" end>AppointmentWorker</Nav.Link>
            <Nav.Link as={NavLink} to="/settings">
              <BsFillGearFill/>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
