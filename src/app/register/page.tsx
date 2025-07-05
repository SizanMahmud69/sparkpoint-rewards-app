import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
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
      </main>
      <footer className="w-full py-6 mt-auto bg-card border-t">
        <div className="container mx-auto text-center text-muted-foreground">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mb-4">
                <Link href="/contact-us" className="text-sm hover:text-primary transition-colors">Contact Us</Link>
                <Link href="/privacy-policy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
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
