import React from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

// parameters -> (role, component to render)
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
