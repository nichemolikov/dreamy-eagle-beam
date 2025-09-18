import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '@/hooks/use-user-role'; // Import the new hook

const Login = () => {
  const navigate = useNavigate();
  const { role, isLoading: isLoadingRole } = useUserRole();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Wait for role to be loaded before redirecting
        if (!isLoadingRole && role) {
          if (role === 'admin') {
            navigate('/admin/overview');
          } else if (role === 'client') {
            navigate('/dashboard');
          } else {
            navigate('/'); // Default redirect if role is unknown
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, role, isLoadingRole]); // Depend on role and isLoadingRole

  // If role is already loaded and user is authenticated, redirect immediately
  if (!isLoadingRole && role) {
    if (role === 'admin') {
      navigate('/admin/overview');
    } else if (role === 'client') {
      navigate('/dashboard');
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Вход в клиентски портал</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;