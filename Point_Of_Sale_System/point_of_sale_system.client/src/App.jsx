import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppLayoutBase from './app_layout/AppLayoutBase.jsx'
import './App.css';
import WeatherForecast from './WeatherForecast.jsx';
import Register from './pages/login/Register.jsx';
import Login from './pages/login/Login.jsx';
import Layout from './app_layout/Layout.jsx';
import RequireAuth from './RequireAuth.jsx';

import Orders from './pages/orders/Orders.jsx';
import Inventory from './pages/inventory/Inventory.jsx';
import Employees from './pages/employees/Employees.jsx';

const BASE_URL = "http://localhost:5098"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route path="/login" element={<Login /> } />
                <Route path="/register" element={<Register />} />

                <Route element={<RequireAuth />}>
                    <Route element={<AppLayoutBase />}> {/* Route kad atsirastu navbar, jo nereikia login ir register page'ui*/}
                        <Route path="/" element={<WeatherForecast />} /> {/* Placeholder Weather forecast vietoj actual home page'o, tsg nzn kas jame turi buti */}
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/employees" element={<Employees />} />
                    </Route>
                </Route>

            </Route>
        </Routes>
    )
}

export default App;