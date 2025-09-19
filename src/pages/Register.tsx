import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <RegisterForm />
    </div>
  );
};

export default Register;