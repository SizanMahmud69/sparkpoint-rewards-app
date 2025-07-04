"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CreditCard, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '../ui/sidebar';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
            <div className={state === 'collapsed' ? 'hidden' : ''}>
                <Link href="/admin/dashboard">
                    <Logo />
                </Link>
            </div>
            <SidebarTrigger className="hidden sm:flex" />
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton 
                  isActive={pathname === item.href}
                  tooltip={{children: item.label}}
                  asChild
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <Link href="/" legacyBehavior passHref>
            <SidebarMenuButton tooltip={{children: "Logout"}} asChild>
                <a>
                    <LogOut />
                    <span>Logout</span>
                </a>
            </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </>
  );
}
