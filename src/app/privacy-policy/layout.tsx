"use client";

import { UserHeader } from '@/components/user/UserHeader';
import { UserPointsProvider } from '@/context/UserPointsContext';
import Link from 'next/link';

export default function PrivacyPolicyLayout({
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
    </UserPointsProvider>
  );
}
