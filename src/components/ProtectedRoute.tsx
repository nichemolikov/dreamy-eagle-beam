import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { useUserRole } from '@/hooks/use-user-role'; // Import the new hook

interface ProtectedRouteProps {
  session: Session | null;
  allowedRoles?: ("client" | "admin")[]; // New prop to specify allowed roles
  redirectTo?: string; // New prop for custom redirect
}

const ProtectedRoute = ({ session, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { role, isLoading: isLoadingRole } = useUserRole();

  if (isLoadingRole) {
    return <div>Зареждане на потребителски данни...</div>; // Or a spinner/skeleton
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role as "client" | "admin")) {
    // If user is logged in but doesn't have the required role, redirect to home or a forbidden page
    return <Navigate to="/" replace />; // Redirect to home or a specific "access denied" page
  }

  return <Outlet />;
};

export default ProtectedRoute;