import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                    <Routes>
                        <Route path="/*" element={<App />} />
                        </Routes>
                    </AuthProvider>
            </BrowserRouter>
    </StrictMode>
);
