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

import AppAbout from './pages/about/AppAbout.jsx';
import Schedule from './pages/schedule/Schedule.jsx';
import OrderHistory from './pages/history/OrderHistory.jsx';
import Settings from './pages/settings/Settings.jsx';
import AppHistory from './pages/history/AppHistory.jsx';
import Services from './pages/services/Services.jsx';

const BASE_URL = "http://localhost:5098"

function App() {
    return (
        <div className='app-container'>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login /> } />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<AppLayout />}>
                    {/* Admin specific routes */}
                    <Route path="/superadmin" element={<RequireAuth authLevel="admin"><Superadmin /></RequireAuth>} />
                    {/* Owner specific routes */}
                    {/* <Route path="/owner" element={<RequireAuth authLevel="owner"><OwnerPage /></RequireAuth>} /> */}
                    {/* Manager specific routes */}
                    <Route path="/employees" element={<RequireAuth authLevel="manager"><Employees /></RequireAuth>} />
                    <Route path="/inventory" element={<RequireAuth authLevel="manager"><Inventory /></RequireAuth>} />
                    <Route path="/settings" element={<RequireAuth authLevel="manager"><Settings /></RequireAuth>} />
                    <Route path="/menuManagement" element={<RequireAuth authLevel="manager"><MenuManagement /></RequireAuth>} />
                    {/* Employee specific routes */}
                    <Route path="/" element={<RequireAuth authLevel="employee"><About /></RequireAuth>} />
                    <Route path="/orderHistory" element={<RequireAuth authLevel="employee"><OrderHistory /></RequireAuth>} />
                    <Route path="/services" element={<RequireAuth authLevel="employee"><Services /></RequireAuth>} />
                    <Route path="/schedule" element={<RequireAuth authLevel="employee"><Schedule /></RequireAuth>} />
                    <Route path="/appAbout" element={<RequireAuth authLevel="employee"><AppAbout /></RequireAuth>} />
                    <Route path="/appHistory" element={<RequireAuth authLevel="employee"><AppHistory /></RequireAuth>} />
                    <Route path="/orders" element={<RequireAuth authLevel="employee"><Orders /></RequireAuth>} />
                </Route>
            </Routes>
        </div>
    )
}

export default App;