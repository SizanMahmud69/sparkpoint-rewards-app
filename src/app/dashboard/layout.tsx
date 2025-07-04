import { UserHeader } from '@/components/user/UserHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
