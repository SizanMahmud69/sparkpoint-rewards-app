"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Admin Panel</h1>
    </header>
  );
}
