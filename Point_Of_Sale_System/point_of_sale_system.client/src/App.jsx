import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap 

import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx';

import Register from './pages/login/Register.jsx';
import Login from './pages/login/Login.jsx';
import RequireAuth from './utilities/RequireAuth.jsx';

import About from './pages/about/About.jsx';
import Orders from './pages/orders/orders.jsx';
import Inventory from './pages/inventory/inventory.jsx';
import Employees from './pages/employees/employees.jsx';

const BASE_URL = "http://localhost:5098"

function App() {
    return (
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
                </Route>
            </Route>
        </Routes>
    )
}

export default App;