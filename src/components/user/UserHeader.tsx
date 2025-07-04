
"use client";

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user/UserNav';
import { Coins } from 'lucide-react';
import { useUserPoints } from '@/context/UserPointsContext';

export function UserHeader() {
  const { points } = useUserPoints();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo className="hidden md:flex" />
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Profile
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/wallet" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Wallet
              </Link>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <Coins className="h-5 w-5" />
                <span>{points.toLocaleString()} Points</span>
            </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
