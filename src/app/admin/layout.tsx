
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import Link from 'next/link';

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
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-2">
                        <p className="text-center sm:text-left">
                            Copyright © {currentYear} <span className="font-semibold text-primary">SparkPoint</span>. Developed by <span className="font-semibold text-primary">Black Diamond</span>.
                        </p>
                        <div className="flex items-center gap-x-4">
                            <Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
                            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </SidebarProvider>
    </div>
  );
}
