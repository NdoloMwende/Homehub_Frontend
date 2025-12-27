import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: ReactNode;
  allowedRoles: ("admin" | "landlord" | "tenant")[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // landlord not approved yet
  if (user.role === "landlord" && user.approved === false) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
