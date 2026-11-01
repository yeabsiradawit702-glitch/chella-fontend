
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface PrivateRoutesProps {
  allowedRoles?: ("admin" | "member")[];
}

const PrivateRoutes = ({ allowedRoles }: PrivateRoutesProps) => {
  const { user, loading } = useContext(UserContext);

  // Wait until the profile request finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium">
          Loading your account...
        </p>
      </div>
    );
  }

  // Redirect only after authentication check finishes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;