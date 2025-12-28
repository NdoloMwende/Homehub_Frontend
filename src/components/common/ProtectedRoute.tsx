// import { Navigate } from "react-router-dom";
// import { type ReactNode } from "react";
// import { useAuth } from "../../context/AuthContext";

// interface Props {
//   children: ReactNode;
//   allowedRoles: ("admin" | "landlord" | "tenant")[];
// }

// const ProtectedRoute = ({ children, allowedRoles }: Props) => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   // landlord not approved yet
//   if (user.role === "landlord" && user.approved === false) {
//     return <Navigate to="/verify-email" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: ("admin" | "landlord" | "tenant")[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  // TEMP MOCK AUTH (DEV ONLY)
  const mockUser: { isAuthenticated: boolean; role: "admin" | "landlord" | "tenant" } = {
    isAuthenticated: true,
    role: "admin" // change to "admin" or "tenant" when testing
  };

  if (!mockUser.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(mockUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
