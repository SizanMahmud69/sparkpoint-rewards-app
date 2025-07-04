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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';

export function WithdrawalTable({ withdrawals: initialWithdrawals }: { withdrawals: Withdrawal[] }) {
  const [withdrawals, setWithdrawals] = React.useState(initialWithdrawals);

  const handleStatusChange = (id: number, newStatus: Withdrawal['status']) => {
    // In a real app, this would be an API call.
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };
  
  const getStatusBadgeVariant = (status: Withdrawal['status']): "default" | "secondary" | "destructive" | "outline" => {
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
              <TableHead className="text-right">Actions</TableHead>
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
                    <Badge variant={getStatusBadgeVariant(w.status)}>{w.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {w.status === 'Pending' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(w.id, 'Completed')}>
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(w.id, 'Rejected')}>
                                    Reject
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
