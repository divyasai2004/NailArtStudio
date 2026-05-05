import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false, noAdmin = false }) => {
  const { isAuthenticated, authUser } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !authUser?.isAdmin) return <Navigate to="/" replace />;
  // Block admins from customer-only routes
  if (noAdmin && authUser?.isAdmin) return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
