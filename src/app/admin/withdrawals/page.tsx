"use client";

import { useState } from 'react';
import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { WithdrawalFormManagement } from '@/components/admin/WithdrawalFormManagement';
import { WithdrawalSettings } from '@/components/admin/WithdrawalSettings';
import { mockWithdrawals, mockPaymentMethods, mockUsers } from '@/lib/data';
import type { Withdrawal, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();

  const initialMinWithdrawal = 1000;

  const handleStatusChange = (id: number, newStatus: Withdrawal['status']) => {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    setWithdrawals(currentWithdrawals =>
      currentWithdrawals.map(w =>
        w.id === id ? { ...w, status: newStatus } : w
      )
    );

    if (newStatus === 'Rejected') {
      setUsers(currentUsers =>
        currentUsers.map(user => {
          if (user.id === withdrawal.userId) {
            toast({
              title: "Withdrawal Rejected",
              description: `${withdrawal.amountPoints.toLocaleString()} points have been refunded to ${withdrawal.userName}.`
            });
            return { ...user, points: user.points + withdrawal.amountPoints };
          }
          return user;
        })
      );
    } else if (newStatus === 'Completed') {
       toast({
          title: "Withdrawal Approved",
          description: `Request for ${withdrawal.amountPoints.toLocaleString()} points from ${withdrawal.userName} has been marked as completed.`
        });
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Withdrawal Management</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <WithdrawalFormManagement initialMethods={mockPaymentMethods} />
        </div>
        <div className="xl:col-span-1">
          <WithdrawalSettings initialMinWithdrawal={initialMinWithdrawal} />
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
