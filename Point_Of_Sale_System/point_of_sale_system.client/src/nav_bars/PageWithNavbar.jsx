import { Outlet } from "react-router-dom";
import BasicNavbar from "./BasicNavbar";

export default function PageWithNavbar() {
    return (
        <>
            <BasicNavbar />
            <Outlet />
        </>
    );
}