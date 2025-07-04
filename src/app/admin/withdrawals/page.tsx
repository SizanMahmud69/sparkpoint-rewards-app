
"use client";

import { useState, useEffect } from 'react';
import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { getWithdrawals, updateWithdrawalStatus, getUsers, updateUserPoints, addPointTransaction, addNotification } from '@/lib/storage';
import type { Withdrawal, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoading(true);
    const [w, u] = await Promise.all([getWithdrawals(), getUsers()]);
    setWithdrawals(w);
    setUsers(u);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Withdrawal['status']) => {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    await updateWithdrawalStatus(id, newStatus);
    
    const notificationDate = new Date().toISOString();

    if (newStatus === 'Rejected') {
      await updateUserPoints(withdrawal.userId, withdrawal.amountPoints);
      
      toast({
        title: "Withdrawal Rejected",
        description: `${withdrawal.amountPoints.toLocaleString()} points have been refunded to ${withdrawal.userName}.`
      });
      
      await addPointTransaction({
          userId: withdrawal.userId,
          task: 'Refund: Withdrawal Rejected',
          points: withdrawal.amountPoints,
          date: notificationDate,
      });
      
      await addNotification({
          userId: withdrawal.userId,
          title: 'Withdrawal Request Rejected',
          description: `Your request for ${withdrawal.amountPoints.toLocaleString()} points was rejected. The points have been refunded to your account.`,
          type: 'error',
          read: false,
          date: notificationDate,
      });

    } else if (newStatus === 'Completed') {
       toast({
          title: "Withdrawal Approved",
          description: `Request for ${withdrawal.amountPoints.toLocaleString()} points from ${withdrawal.userName} has been marked as completed.`
        });

       await addNotification({
          userId: withdrawal.userId,
          title: 'Withdrawal Approved!',
          description: `Your withdrawal of ${withdrawal.amountPoints.toLocaleString()} points ($${withdrawal.amountUSD.toFixed(2)}) has been processed successfully.`,
          type: 'success',
          read: false,
          date: notificationDate,
      });
    }
    refreshData();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Review and process all user withdrawal requests from this page.</p>
      </div>
      
      <WithdrawalTable 
        withdrawals={withdrawals} 
        users={users}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </div>
  );
}
