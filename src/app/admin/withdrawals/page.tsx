
"use client";

import { useState, useEffect } from 'react';
import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { WithdrawalFormManagement } from '@/components/admin/WithdrawalFormManagement';
import { WithdrawalSettings } from '@/components/admin/WithdrawalSettings';
import { getWithdrawals, saveWithdrawals, getUsers, saveUsers, getPaymentMethods, addPointTransaction, addNotification } from '@/lib/storage';
import type { Withdrawal, User, PaymentMethod } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { toast } = useToast();

  const refreshData = () => {
    setWithdrawals(getWithdrawals());
    setUsers(getUsers());
    setPaymentMethods(getPaymentMethods());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = (id: number, newStatus: Withdrawal['status']) => {
    const currentWithdrawals = getWithdrawals();
    const withdrawal = currentWithdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    const updatedWithdrawals = currentWithdrawals.map(w =>
      w.id === id ? { ...w, status: newStatus } : w
    );
    saveWithdrawals(updatedWithdrawals);
    
    const notificationDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (newStatus === 'Rejected') {
      const allUsers = getUsers();
      const updatedUsers = allUsers.map(user => {
        if (user.id === withdrawal.userId) {
          toast({
            title: "Withdrawal Rejected",
            description: `${withdrawal.amountPoints.toLocaleString()} points have been refunded to ${withdrawal.userName}.`
          });
          return { ...user, points: user.points + withdrawal.amountPoints };
        }
        return user;
      });
      saveUsers(updatedUsers);
      
      addPointTransaction({
          userId: withdrawal.userId,
          task: 'Refund: Withdrawal Rejected',
          points: withdrawal.amountPoints,
          date: notificationDate,
      });
      
      addNotification({
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

       addNotification({
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
      <h1 className="text-3xl font-bold font-headline">Withdrawal Management</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <WithdrawalFormManagement 
            initialMethods={paymentMethods}
            onMethodsUpdate={refreshData}
          />
        </div>
        <div className="xl:col-span-1">
          <WithdrawalSettings />
        </div>
      </div>
      
      <WithdrawalTable 
        withdrawals={withdrawals} 
        users={users}
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}
