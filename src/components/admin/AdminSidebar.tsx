"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CreditCard, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
       <div className="p-4">
        <Link href="/admin/dashboard">
          <Logo />
        </Link>
      </div>
      <Separator className='bg-sidebar-border/50'/>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Separator className='bg-sidebar-border/50 mb-4'/>
        <Link href="/">
           <Button variant="ghost" className="w-full justify-start gap-3">
             <LogOut className="h-4 w-4" />
             <span>Logout</span>
           </Button>
        </Link>
      </div>
    </aside>
  );
}
