import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('PATIENT' | 'DOCTOR')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { authenticated, user } = useAuthStore();
  const location = useLocation();

  if (!authenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on their actual role
    if (user.role === 'DOCTOR') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
