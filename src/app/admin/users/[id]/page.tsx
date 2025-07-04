
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, Coins } from 'lucide-react';
import { PointsHistoryTable } from '@/components/user/PointsHistoryTable';
import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { getUserById, getPointHistoryForUser, getWithdrawalsForUser } from '@/lib/storage';
import type { User, PointTransaction, Withdrawal } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const getStatusBadgeClass = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'border-transparent bg-green-500/20 text-green-700 dark:text-green-400';
      case 'Suspended':
        return 'border-transparent bg-red-500/20 text-red-600 dark:text-red-400';
      case 'Frozen':
        return 'border-transparent bg-blue-500/20 text-blue-700 dark:text-blue-400';
      default:
        return '';
    }
};

const getStatusBadgeVariant = (status: User['status']): "outline" => {
    return 'outline';
};


export default function UserDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
    const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const id = params.id as string;
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            const foundUser = await getUserById(id);
            if (foundUser) {
                setUser(foundUser);
                const [points, withdrawals] = await Promise.all([
                    getPointHistoryForUser(id),
                    getWithdrawalsForUser(id)
                ]);
                setPointHistory(points);
                setWithdrawalHistory(withdrawals);
            } else {
                router.push('/admin/users');
            }
            setLoading(false);
        };

        fetchData();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
                        <Card><CardHeader><Skeleton className="h-48 w-full" /></CardHeader></Card>
                    </div>
                     <div className="lg:col-span-2 space-y-8">
                        <Card><CardHeader><Skeleton className="h-64 w-full" /></CardHeader></Card>
                        <Card><CardHeader><Skeleton className="h-64 w-full" /></CardHeader></Card>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold font-headline">User Details</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - User Info */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader className="items-center text-center p-6">
                             <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
                            <CardDescription>ID: {user.id}</CardDescription>
                            <Badge variant={getStatusBadgeVariant(user.status)} className={cn("mt-2", getStatusBadgeClass(user.status))}>{user.status}</Badge>
                        </CardHeader>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                             <div className="flex items-center gap-4">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <span>Joined on {new Date(user.registrationDate).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Points Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Coins className="h-8 w-8 text-primary" />
                            <div className="text-3xl font-bold font-headline">{user.points.toLocaleString()}</div>
                            <span>Points</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - History Tables */}
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Points History</CardTitle>
                            <CardDescription>A log of all points this user has earned or spent.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[400px] overflow-y-auto pr-2">
                                <PointsHistoryTable transactions={pointHistory} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal History</CardTitle>
                             <CardDescription>A log of all withdrawal requests from this user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="max-h-[400px] overflow-y-auto pr-2">
                               <WithdrawalTable withdrawals={withdrawalHistory} users={[user]} isUserView={true} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
