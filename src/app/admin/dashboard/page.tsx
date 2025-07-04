import { StatCard } from '@/components/shared/StatCard';
import { Users, CreditCard, CircleDollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Registered Users"
          value="1,254"
          icon={Users}
          description="+20.1% from last month"
        />
        <StatCard 
          title="Pending Withdrawals"
          value="12"
          icon={CreditCard}
          description="Awaiting approval"
        />
        <StatCard 
          title="Total Points Earned (All Users)"
          value="5,432,100"
          icon={CircleDollarSign}
          description="Total points accumulated"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
        {/* In a real app, this would be a feed of recent user registrations, withdrawals, etc. */}
        <div className="p-4 bg-card rounded-lg shadow-md">
          <p className="text-muted-foreground">Activity feed coming soon.</p>
        </div>
      </div>
    </div>
  );
}
