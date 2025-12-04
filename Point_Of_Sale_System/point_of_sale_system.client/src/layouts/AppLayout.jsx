import { Outlet } from "react-router-dom";
import AppNavbar from "../pages/navbars/AppWorkerNavbar";

export default function AppLayout() {
    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    )
}
