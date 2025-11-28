import { Outlet } from "react-router-dom";
import Navbar from "../pages/navbars/Navbar";

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}
