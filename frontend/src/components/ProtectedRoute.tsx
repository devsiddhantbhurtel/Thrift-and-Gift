// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  role?: "buyer" | "seller"; // Optional role restriction
  requireSuperuser?: boolean; // Add this prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, requireSuperuser }) => {
  const { isAuthenticated, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if we have tokens in localStorage
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userData = localStorage.getItem("user");

    // If we have either valid tokens or confirmed no auth, mark as initialized
    if ((!accessToken && !refreshToken) || (isAuthenticated && user) || (!isAuthenticated && !userData)) {
      setIsInitialized(true);
    }
  }, [isAuthenticated, user]);

  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add superuser check
  if (requireSuperuser && (!user?.is_superuser)) {
    return <Navigate to="/" replace />;
  }

  // If the route is restricted by role and the user is authenticated
  if (role && isAuthenticated && user?.role !== role) {
    return <Navigate to="/" replace />; // Redirect to home if the role doesn't match
  }

  // If the user is not authenticated and the route requires authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  // If the user is authenticated and the role matches (or no role restriction)
  return <Outlet />; // Render the child routes
};

export default ProtectedRoute;