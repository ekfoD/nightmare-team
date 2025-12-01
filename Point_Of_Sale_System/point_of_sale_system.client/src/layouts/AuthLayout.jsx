import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const AuthLayout = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Outlet/>
        </Container>
        
    );
}

export default AuthLayout;