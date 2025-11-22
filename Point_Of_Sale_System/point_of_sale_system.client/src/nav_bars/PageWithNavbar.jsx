import { Outlet } from "react-router-dom";
import BasicNavbar from "./BasicNavbar";
import TopBarBase from "./TopBarBase";

export default function PageWithNavbar() {
    return (
        <>
            <TopBarBase />
            <div>
            <BasicNavbar />
                <Outlet />
            </div>
        </>
    );
}