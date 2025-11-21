import React from "react";
import BasicNavbar from "../nav_bars/BasicNavbar.jsx";
import TopBarBase from "../nav_bars/TopBarBase.jsx";

export default function AppLayoutBase({ children }) {
    return (
        <div className="LayoutContainer">
            <TopBarBase/>

            {/* Horizontal area below the top bar */}
            <div className="ContentArea">
                <BasicNavbar />
                <div className="MainArea">
                    {children}
                </div>
            </div>
        </div>
    );
}
