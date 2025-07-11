
"use client";

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { Users, CreditCard, CircleDollarSign, Activity } from 'lucide-react';
import { OverviewChart } from '@/components/admin/OverviewChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Withdrawal, User } from '@/lib/types';
import { PointsEarnedChart } from '@/components/admin/PointsEarnedChart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getWithdrawals, getTasks, getAllPointHistory, getUsers } from '@/lib/storage';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadgeVariant = (status: Withdrawal['status']) => {
    switch (status) {
        case 'Completed':
            return 'outline';
        case 'Pending':
            return 'secondary';
        case 'Rejected':
            return 'destructive';
        default:
            return 'outline';
    }
};

const getStatusBadgeClass = (status: Withdrawal['status']) => {
    switch (status) {
      case 'Completed':
          return "capitalize border-transparent bg-green-500/20 text-green-700 dark:text-green-400";
      case 'Pending':
          return "capitalize border-transparent bg-yellow-400/20 text-yellow-600 dark:text-yellow-400";
      case 'Rejected':
          return "capitalize border-transparent bg-red-500/20 text-red-600 dark:text-red-400";
      default:
          return "";
    }
};

interface DashboardStats {
  totalUsers: number;
  pendingWithdrawals: number;
  totalPointsEarned: number;
  activeTasks: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentWithdrawals, setRecentWithdrawals] = useState<Withdrawal[]>([]);
  const [userMap, setUserMap] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const [allUsers, allWithdrawals, allTasks, allPointHistory] = await Promise.all([
            getUsers(),
            getWithdrawals({ limit: 5, orderBy: ['date', 'desc'] }),
            getTasks(),
            getAllPointHistory()
        ]);
        
        const totalUsers = allUsers.length;
        const pendingWithdrawalsCount = (await getWithdrawals({ filters: [['status', '==', 'Pending']] })).length;
        const totalPointsEarned = allPointHistory.filter(t => t.points > 0).reduce((sum, t) => sum + t.points, 0);
        const activeTasks = allTasks.filter(t => t.enabled).length;

        setStats({
          totalUsers,
          pendingWithdrawals: pendingWithdrawalsCount,
          totalPointsEarned,
          activeTasks,
        });
        
        setRecentWithdrawals(allWithdrawals);
        setUserMap(new Map(allUsers.map(user => [user.id, user])));
        setLoading(false);
    }
    fetchData();
  }, []);

  const formatPoints = (points: number) => {
    if (points >= 1_000_000) {
      return `${(points / 1_000_000).toFixed(1)}M`;
    }
    if (points >= 1_000) {
      return `${(points / 1_000).toFixed(1)}k`;
    }
    return points.toString();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats && !loading ? (
          <>
            <StatCard 
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              description="Total registered users"
              color="bg-blue-500"
            />
            <StatCard 
              title="Pending Withdrawals"
              value={stats.pendingWithdrawals.toLocaleString()}
              icon={CreditCard}
              description="Awaiting approval"
              color="bg-yellow-500"
            />
            <StatCard 
              title="Total Points Earned"
              value={formatPoints(stats.totalPointsEarned)}
              icon={CircleDollarSign}
              description="Across all users"
              color="bg-green-500"
            />
            <StatCard 
              title="Active Tasks"
              value={stats.activeTasks.toLocaleString()}
              icon={Activity}
              description="Enabled for users"
              color="bg-purple-500"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
             <Card key={index} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </CardContent>
             </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewChart />
        <PointsEarnedChart />
      </div>

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
                        <TableHead className="hidden sm:table-cell">Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentWithdrawals.length > 0 ? recentWithdrawals.map(w => {
                        const user = userMap.get(w.userId);
                        return (
                        <TableRow key={w.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 hidden sm:flex">
                                        <AvatarImage src={user?.avatar} alt={user?.name} data-ai-hint="person face" />
                                        <AvatarFallback>{w.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{w.userName}</div>
                                        <div className="text-sm text-muted-foreground">{new Date(w.date).toLocaleString()}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <div className="font-medium">{w.method}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{w.details}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="font-bold">{w.amountPoints.toLocaleString()} pts</div>
                                <div className="text-xs text-muted-foreground">${w.amountUSD.toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant={getStatusBadgeVariant(w.status)} className={getStatusBadgeClass(w.status)}>{w.status}</Badge>
                            </TableCell>
                        </TableRow>
                    )}) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          {loading ? 'Loading...' : 'No recent withdrawals.'}
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
