import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";
import { hasAccess } from "./permissions.js";

const RequireAuth = ({ minRole, business, children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth?.role) {
    return <Navigate to="/login" replace />;
  }

  const allowed = hasAccess({
    userRole: auth.role,
    businessType: auth.businessType,
    minRole,
    allowedBusiness: business,
  });

  if (!allowed) return <div>Unauthorized</div>;

  return children ? children : <Outlet />;
};

export default RequireAuth;