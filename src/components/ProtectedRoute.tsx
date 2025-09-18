import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { useUserRole } from '@/hooks/use-user-role';

interface ProtectedRouteProps {
  session: Session | null;
  allowedRoles?: ("client" | "admin")[];
  redirectTo?: string; // Default is /login for general, but can be / for admin-only
}

const ProtectedRoute = ({ session, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { role, isLoading: isLoadingRole } = useUserRole();

  if (isLoadingRole) {
    return <div>Зареждане на потребителски данни...</div>;
  }

  if (!session) {
    // If not authenticated, redirect to the specified login page.
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated. Now check roles.
  if (allowedRoles) {
    // If the user's role is not in the allowed roles for this route (or role is null).
    if (role === null || !allowedRoles.includes(role as "client" | "admin")) {
      // Special handling for admin-only routes:
      // If an authenticated non-admin (or user with null role) tries to access an admin route,
      // redirect them to the client dashboard instead of the public home page.
      if (redirectTo === "/") { // This condition typically means it's an admin-only route
        return <Navigate to="/dashboard" replace />;
      }
      // For other protected routes (like /dashboard itself), if role is not allowed,
      // redirect to the specified redirectTo (which defaults to /login if no session, but session exists here).
      return <Navigate to={redirectTo} replace />;
    }
  }

  // If no allowedRoles are specified, or if the user has an allowed role, grant access.
  return <Outlet />;
};

export default ProtectedRoute;