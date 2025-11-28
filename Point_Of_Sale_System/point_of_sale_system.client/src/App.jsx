import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap 

import "./styles/App.css";

import MainLayout from './layouts/MainLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

import Register from './pages/login/Register.jsx';
import Login from './pages/login/Login.jsx';
import RequireAuth from './utilities/RequireAuth.jsx';

import About from './pages/about/About.jsx';
import Orders from './pages/orders/orders.jsx';
import Inventory from './pages/inventory/inventory.jsx';
import Employees from './pages/employees/employees.jsx';

import AppAbout from './pages/about/AppAbout.jsx';
import Services from './pages/services/Services.jsx';
import Calendar from './pages/calendar/Calendar.jsx';
import Schedule from './pages/schedule/Schedule.jsx';

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
                        <Route path="/" element={<About />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/employees" element={<Employees />} />
                    </Route>
                    <Route element={<AppLayout />}>
                        <Route path="/appAbout" element={<AppAbout />} /> 
                        <Route path="/services" element={<Services />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/schedule" element={<Schedule />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    )
}

export default App;