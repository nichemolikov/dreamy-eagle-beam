import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '@/hooks/use-user-role';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { role, isLoading: isLoadingRole } = useUserRole();

  useEffect(() => {
    if (!isLoadingRole) {
      if (role === 'admin') {
        navigate('/admin/overview', { replace: true });
      } else if (role === 'client') {
        navigate('/dashboard', { replace: true });
      } else {
        // If role is null (e.g., new user, or profile not fully set up yet),
        // check if they are authenticated. If so, default to client dashboard.
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            navigate('/dashboard', { replace: true });
          }
        });
      }
    }
  }, [navigate, role, isLoadingRole]);

  // Show a loading state while the role is being determined
  if (isLoadingRole) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-150px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Зареждане...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Проверяваме вашия статус...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If role is already determined and user is redirected, this component should not render the Auth form.
  // The useEffect above handles the redirection. If we reach here, it means the user is not authenticated
  // or has no defined role and should see the login form.
  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Вход в клиентски портал</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;