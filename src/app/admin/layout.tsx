import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
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
        </SidebarProvider>
    </div>
  );
}
