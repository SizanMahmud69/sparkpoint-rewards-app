"use client";

import { UserHeader } from '@/components/user/UserHeader';
import { UserPointsProvider } from '@/context/UserPointsContext';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserPointsProvider>
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <main className="flex-grow bg-muted/20">
          <div className="container mx-auto w-full max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
              {children}
          </div>
        </main>
      </div>
    </UserPointsProvider>
  );
}
