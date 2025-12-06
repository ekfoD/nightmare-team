import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap 

import "./styles/App.css";

import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx';

import Register from './pages/login/Register.jsx';
import Login from './pages/login/Login.jsx';
import RequireAuth from './utilities/RequireAuth.jsx';

import About from './pages/about/About.jsx';
import Orders from './pages/orders/orders.jsx';
import Inventory from './pages/inventory/inventory.jsx';
import Employees from './pages/employees/employees.jsx';
import Settings from './pages/settings/Settings.jsx';

const BASE_URL = "http://localhost:5098"

function App() {
    return (
        <div className='app-container'>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login /> } />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<RequireAuth />}>
                    <Route element={<MainLayout />}> {/* Route kad atsirastu navbar, jo nereikia login ir register page'ui*/}
                        <Route path="/" element={<About />} /> {/* Placeholder Weather forecast vietoj actual home page'o, tsg nzn kas jame turi buti */}
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/settings" element={<Settings/>} />
                    </Route>
                </Route>
            </Routes>
        </div>
    )
}

export default App;