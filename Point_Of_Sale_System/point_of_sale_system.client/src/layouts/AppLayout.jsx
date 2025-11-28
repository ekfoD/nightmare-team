import { Outlet } from "react-router-dom";
import AppNavbar from "../pages/navbars/AppNavbar";

export default function AppLayout() {
    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    )
}
