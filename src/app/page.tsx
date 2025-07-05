
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
      <footer className="w-full py-4 mt-auto bg-card border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-2">
            <p className="text-center sm:text-left">
                Copyright © {currentYear} <span className="font-semibold text-primary">SparkPoint</span>. Developed by <span className="font-semibold text-primary">Black Diamond</span>.
            </p>
            <div className="flex items-center gap-x-4">
                <Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
