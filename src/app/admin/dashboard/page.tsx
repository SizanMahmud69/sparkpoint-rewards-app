import { StatCard } from '@/components/shared/StatCard';
import { Users, CreditCard, CircleDollarSign, Activity } from 'lucide-react';
import { OverviewChart } from '@/components/admin/OverviewChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockWithdrawals } from '@/lib/data';
import type { Withdrawal } from '@/lib/types';

const getStatusBadgeVariant = (status: Withdrawal['status']) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function AdminDashboardPage() {
  const recentWithdrawals = mockWithdrawals.slice(0, 5); // Get first 5 for dashboard

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users"
          value="1,254"
          icon={Users}
          description="+20.1% from last month"
          color="bg-blue-500"
        />
        <StatCard 
          title="Pending Withdrawals"
          value="12"
          icon={CreditCard}
          description="Awaiting approval"
          color="bg-yellow-500"
        />
        <StatCard 
          title="Total Points Earned"
          value="5.4M"
          icon={CircleDollarSign}
          description="Across all users"
           color="bg-green-500"
        />
        <StatCard 
          title="Active Tasks"
          value="3"
          icon={Activity}
          description="Enabled for users"
           color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <OverviewChart />
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Withdrawals</CardTitle>
                    <CardDescription>The 5 most recent withdrawal requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentWithdrawals.map(w => (
                                <TableRow key={w.id}>
                                    <TableCell>
                                        <div className="font-medium">{w.userName}</div>
                                        <div className="text-sm text-muted-foreground">{w.amountPoints} pts</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={getStatusBadgeVariant(w.status)}>{w.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
