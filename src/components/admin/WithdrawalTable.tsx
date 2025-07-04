"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Withdrawal } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function WithdrawalTable({ withdrawals: initialWithdrawals }: { withdrawals: Withdrawal[] }) {
  const [withdrawals, setWithdrawals] = React.useState(initialWithdrawals);

  const handleStatusChange = (id: number, newStatus: Withdrawal['status']) => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };
  
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

  return (
     <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Review and manage user withdrawal requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.userName}</TableCell>
                <TableCell>{w.amountPoints.toLocaleString()} pts (${w.amountUSD.toFixed(2)})</TableCell>
                <TableCell>{w.method}</TableCell>
                <TableCell>{w.date}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => handleStatusChange(w.id, value as Withdrawal['status'])} defaultValue={w.status}>
                    <SelectTrigger className={cn(
                      "w-[120px] text-xs font-semibold",
                      w.status === 'Completed' && 'bg-green-100 border-green-300 text-green-800',
                      w.status === 'Pending' && 'bg-yellow-100 border-yellow-300 text-yellow-800',
                      w.status === 'Rejected' && 'bg-red-100 border-red-300 text-red-800'
                    )}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                       <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
