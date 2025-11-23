import React from "react";
import { Outlet } from "react-router-dom";
import BasicNavbar from "../nav_bars/BasicNavbar.jsx";
import TopBarBase from "../nav_bars/TopBarBase.jsx";
import "./AppLayoutBase.css";
export default function AppLayoutBase({ children }) {
    return (
        <div className="LayoutContainer">
            <TopBarBase/>

            {/* Horizontal area below the top bar */}
            <div className="ContentArea">
                <BasicNavbar />
                <div className="MainArea">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
