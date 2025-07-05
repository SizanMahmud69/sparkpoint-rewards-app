
"use client";

import { UserHeader } from '@/components/user/UserHeader';
import { UserPointsProvider } from '@/context/UserPointsContext';
import Link from 'next/link';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <UserPointsProvider>
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <main className="flex-grow bg-muted/20">
          <div className="container mx-auto w-full max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
              {children}
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
    </UserPointsProvider>
  );
}
