// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isActive && location.pathname !== "/reactivate-account") {
    return <Navigate to="/reactivate-account" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
