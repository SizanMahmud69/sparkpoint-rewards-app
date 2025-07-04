import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
        <SidebarProvider defaultOpen={true} collapsible="icon">
            <Sidebar>
                <AdminSidebar />
            </Sidebar>
            <div className="flex flex-col flex-1">
                <AdminHeader />
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    </div>
  );
}
