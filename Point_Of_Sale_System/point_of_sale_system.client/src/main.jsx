import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import BasicNavbar from './nav_bars/BasicNavbar.jsx';
import App from './App.jsx';
import AppLayoutBase from './app_layout/AppLayoutBase.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/*",
        element: <h1>Error 404</h1>,
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div className="bottomElement ">
            <AppLayoutBase>
                <RouterProvider router={router} />
            </AppLayoutBase>
            
        </div>
    </StrictMode>
);
