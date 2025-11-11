import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import BasicNavbar from './BasicNavbar.jsx';
import App from './App.jsx';


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
            <BasicNavbar/>
            <RouterProvider router={router} />
        </div>
    </StrictMode>
);
