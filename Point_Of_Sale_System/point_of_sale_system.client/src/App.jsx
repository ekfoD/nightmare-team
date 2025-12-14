import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";

import AuthLayout from "./layouts/AuthLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import Login from "./pages/login/Login.jsx";
import RequireAuth from "./utilities/RequireAuth.jsx";

import Superadmin from "./pages/superadmin/Superadmin.jsx";
import About from "./pages/about/About.jsx";
import Orders from "./pages/orders/orders.jsx";
import Inventory from "./pages/inventory/Inventory.jsx";
import Employees from "./pages/employees/employees.jsx";
import MenuManagement from "./pages/Menu/MenuManagement.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import OrderHistory from "./pages/history/OrderHistory.jsx";
import Settings from "./pages/settings/Settings.jsx";
import AppHistory from "./pages/history/AppHistory.jsx";
import Services from "./pages/services/Services.jsx";

import { ROLES, BUSINESS_TYPES } from "./config/access.js";

function App() {
  return (
    <div className="app-container">
      <Routes>

        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* protected app */}
        <Route element={<MainLayout />}>

            {/* admin */}
            <Route element={<RequireAuth minRole={ROLES.ADMIN} business={[BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]} requireBusiness={false} />}>
                <Route path="/superadmin" element={<Superadmin />} />
            </Route>

            {/* manager */}
            <Route element={<RequireAuth minRole={ROLES.MANAGER} business={[BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]} />}>
                <Route path="/employees" element={<Employees />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            <Route element={<RequireAuth minRole={ROLES.MANAGER} business={[BUSINESS_TYPES.RESTAURANT]} />}>
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/menuManagement" element={<MenuManagement />} />
                <Route path="/orderHistory" element={<OrderHistory />} />
            </Route>

            <Route element={<RequireAuth minRole={ROLES.MANAGER} business={[BUSINESS_TYPES.SERVICE]} />}>
                <Route path="/services" element={<Services />} />
                <Route path="/appHistory" element={<AppHistory />} />
            </Route>

            {/* employee */}
            <Route element={<RequireAuth minRole={ROLES.EMPLOYEE} business={[BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.SERVICE]} />}>
                <Route path="/" element={<About />} />
                <Route path="/orders" element={<Orders />} />
            </Route>

            <Route element={<RequireAuth minRole={ROLES.EMPLOYEE} business={[BUSINESS_TYPES.SERVICE]} />}>
                <Route path="/schedule" element={<Schedule />} />
            </Route>

        </Route>
      </Routes>
    </div>
  );
}

export default App;
