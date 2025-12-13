import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

// Define role hierarchy: higher index = higher privilege
const roleHierarchy = ["employee", "manager", "owner", "admin"];

const RequireAuth = ({ authLevel, children }) => {
  const { auth } = useContext(AuthContext);

  // Not logged in
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  // If no authLevel specified, just check for login
  if (!authLevel) {
    return children ? children : <Outlet />;
  }

  // Get user's highest role (assume roles is an array of strings)
  const userRoles = auth.user.roles || [];
  const userMaxLevel = Math.max(
    ...userRoles.map(r => roleHierarchy.indexOf(r.toLowerCase()))
  );
  const requiredLevel = roleHierarchy.indexOf(authLevel.toLowerCase());

  // If user has a role equal or higher in hierarchy, allow
  if (userMaxLevel >= requiredLevel && userMaxLevel !== -Infinity && requiredLevel !== -1) {
    return children ? children : <Outlet />;
  }

  // Not authorized
  return <div>Unauthorized</div>;
};

export default RequireAuth;