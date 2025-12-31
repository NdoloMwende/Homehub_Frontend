import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  allowedRoles: ("admin" | "landlord" | "tenant")[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user,loading } = useAuth();

  if (loading) {
    return <div>Checking Access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  // landlord approval check
  if (user.role === "landlord" && user.approved === false) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;