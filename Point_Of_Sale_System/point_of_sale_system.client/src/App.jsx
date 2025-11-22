import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppLayoutBase from './app_layout/AppLayoutBase.jsx'
import './App.css';
import AuthProvider from './context/AuthProvider';
import BasicNavbar from './nav_bars/BasicNavbar.jsx';
import WeatherForecast from './WeatherForecast.jsx';
import Register from './login/Register.jsx';
import Login from './login/Login.jsx';
import Layout from './Layout.jsx';
import PageWithNavbar from './nav_bars/PageWithNavbar.jsx';
import RequireAuth from './RequireAuth.jsx';

const BASE_URL = "http://localhost:5098"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route path="/login" element={<Login /> } />
                <Route path="/register" element={<Register />} />

                <Route element={<RequireAuth />}>
                    <Route element={<AppLayoutBase /> }>
                        <Route path="/" element={<WeatherForecast />} />
                        <Route path="/orders" element={<WeatherForecast />} />
                        <Route path="/inventory" element={<WeatherForecast />} />
                        <Route path="/employees" element={<WeatherForecast />} />
                    </Route>
                </Route>

            </Route>
        </Routes>
    )
}

export default App;