import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
            <Logo />
        </div>
        <RegisterForm />
         <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
