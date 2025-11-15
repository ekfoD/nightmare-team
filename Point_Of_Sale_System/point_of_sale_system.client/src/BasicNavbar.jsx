import './BasicNavbar.css'
function BasicNavbar() {
    return (
        <nav>
            <a href="/"><button type="button">Home</button></a>
            <a href="/MenuManagement"><button type="button">Menu Management</button></a>
            <a href="/Orders"><button type="button">Orders</button></a>
            <a href="/Inventory"><button type="button">Inventory</button></a>
            <a href="/Employees"><button type="button">Employees</button></a>
        </nav>
    );
}

export default BasicNavbar;