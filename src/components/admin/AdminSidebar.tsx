"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CreditCard, LogOut, Settings, FileText } from 'lucide-react';
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
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/footer', label: 'Footer', icon: FileText },
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
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                isActive={pathname.startsWith(item.href)}
                tooltip={{children: item.label}}
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <div className="text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          Footer
        </div>
        <SidebarMenuButton tooltip={{children: "Logout"}} asChild>
            <Link href="/">
                <LogOut />
                <span>Logout</span>
            </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </>
  );
}
