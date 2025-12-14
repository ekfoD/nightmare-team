import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";
import { hasAccess } from "./permissions.js";
import { ROLES } from "../config/access.js";

const RequireAuth = ({ minRole, business, requireBusiness = true, children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth?.role) {
    return <Navigate to="/login" replace />;
  }

  if (
    auth.role === ROLES.ADMIN &&
    requireBusiness &&
    !auth.businessId
  ) {
    return <Navigate to="/superadmin" replace />;
  }

  const allowed = hasAccess({
    userRole: auth.role,
    businessType: auth.businessType,
    businessId: auth.businessId,
    minRole,
    allowedBusiness: business,
    requireBusiness,
  });

  if (!allowed) {
    if (auth?.role === ROLES.ADMIN) {
      return <Navigate to="/superadmin" replace />;
    }
    return <div>Unauthorized</div>;
  } 

  return children ? children : <Outlet />;
};

export default RequireAuth;