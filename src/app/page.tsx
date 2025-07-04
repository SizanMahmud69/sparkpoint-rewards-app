import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function LoginPage() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Logo />
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
      <footer className="w-full py-4 bg-card border-t">
        <div className="container mx-auto text-center text-muted-foreground">
            <p className="text-sm">
                Copyright © {currentYear} SparkPoint. All Rights Reserved.
            </p>
            <p className="text-sm mt-1">
                Designed & Developed by <span className="font-semibold text-primary">Black Diamond</span>
            </p>
        </div>
      </footer>
    </div>
  );
}
