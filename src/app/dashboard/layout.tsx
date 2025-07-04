import { Footer } from '@/components/shared/Footer';
import { UserHeader } from '@/components/user/UserHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-grow bg-muted/20">
        <div className="container mx-auto w-full max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
