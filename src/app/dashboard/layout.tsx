
"use client";

import { UserHeader } from '@/components/user/UserHeader';
import { UserPointsProvider } from '@/context/UserPointsContext';

export default function DashboardLayout({
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
    </UserPointsProvider>
  );
}
