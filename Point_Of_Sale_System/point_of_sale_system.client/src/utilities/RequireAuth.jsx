import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

// higher index = higher privilege
const roleHierarchy = ["employee", "manager", "owner", "admin"];

const RequireAuth = ({ authLevel, children }) => {
  const { auth } = useContext(AuthContext);

  // not logged in
  if (!auth?.role) {
    return <Navigate to="/login" replace />;
  }

  // only check login
  if (!authLevel) {
    return children ? children : <Outlet />;
  }

  const userLevel = roleHierarchy.indexOf(auth.role.toLowerCase());
  const requiredLevel = roleHierarchy.indexOf(authLevel.toLowerCase());

  // invalid role or requirement
  if (userLevel === -1 || requiredLevel === -1) {
    return <div>Unauthorized</div>;
  }

  // allow if role is high enough
  if (userLevel >= requiredLevel) {
    return children ? children : <Outlet />;
  }

  return <div>Unauthorized</div>;
};

export default RequireAuth;
