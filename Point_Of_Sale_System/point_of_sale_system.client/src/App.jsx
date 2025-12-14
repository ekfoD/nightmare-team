import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap 

import "./styles/App.css";

import MainLayout from './layouts/MainLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

import Register from './pages/login/Register.jsx';
import Login from './pages/login/Login.jsx';
import RequireAuth from './utilities/RequireAuth.jsx';
import Superadmin from './pages/superadmin/Superadmin.jsx'

import About from './pages/about/About.jsx';
import Orders from './pages/orders/orders.jsx';
import Inventory from './pages/inventory/Inventory.jsx';
import Employees from './pages/employees/employees.jsx';
import MenuManagement from './pages/Menu/MenuManagement.jsx';
import OrderHistory from './pages/history/OrderHistory.jsx';
import Settings from './pages/settings/Settings.jsx';

import AppAbout from './pages/about/AppAbout.jsx';
import Schedule from './pages/schedule/Schedule.jsx';
import AppHistory from './pages/history/AppHistory.jsx';
import Services from './pages/services/Services.jsx';
import Management from './pages/management/management.jsx';
import AppointmentPayments from './pages/processing/AppointmentPayments.jsx';

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
                        <Route path="/superadmin" element={<Superadmin /> } />
                        <Route path="/orderHistory" element={<OrderHistory /> }/>
                        <Route path="/menu" element={<MenuManagement />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/management" element={<Management />} />
                        <Route path="/settings" element={<Settings/>} />
                    </Route>
                    <Route element={<AppLayout />}>
                        <Route path="/appAbout" element={<AppAbout />} /> 
                        <Route path="/appHistory" element={<AppHistory /> }/>
                        <Route path="/appPayment" element={<AppointmentPayments /> }/>
                        <Route path="/services" element={<Services /> }/>
                        <Route path="/schedule" element={<Schedule />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    )
}

export default App;