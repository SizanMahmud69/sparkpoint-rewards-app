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
import { mockUsers } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export function WithdrawalTable({
  withdrawals: initialWithdrawals,
  isUserView = false,
}: {
  withdrawals: Withdrawal[];
  isUserView?: boolean;
}) {
  const [withdrawals, setWithdrawals] = React.useState(initialWithdrawals);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const userMap = React.useMemo(() => new Map(mockUsers.map(user => [user.id, user])), []);


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

  const filteredWithdrawals = !isUserView
    ? withdrawals.filter(w => {
      const matchesSearch = w.userName.toLowerCase().includes(searchTerm.toLowerCase()) || w.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    : withdrawals;

  return (
     <Card>
      {!isUserView && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <CardTitle>Withdrawal History</CardTitle>
                  <CardDescription>Review and manage user withdrawal requests.</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                          placeholder="Search by user or details..." 
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={isUserView ? 'pt-6' : ''}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell w-[150px]">Date & Time</TableHead>
              {!isUserView && <TableHead>User</TableHead>}
              <TableHead>Method & Details</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-[120px]">Status</TableHead>
              {!isUserView && <TableHead className="text-right w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWithdrawals.length > 0 ? filteredWithdrawals.map((w) => {
              const user = userMap.get(w.userId);
              return (
              <TableRow key={w.id}>
                <TableCell className="hidden md:table-cell">
                  <div className="font-mono text-sm">{w.date.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground font-mono">{w.date.split(' ').slice(1).join(' ')}</div>
                </TableCell>
                {!isUserView && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 hidden sm:flex">
                          <AvatarImage src={user?.avatar} alt={user?.name} data-ai-hint="person face" />
                          <AvatarFallback>{w.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <div className="font-medium">{w.userName}</div>
                          <div className="text-xs text-muted-foreground">ID: {w.userId}</div>
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="font-medium">{w.method}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">{w.details}</div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="font-bold">{w.amountPoints.toLocaleString()} pts</div>
                    <div className="text-xs text-muted-foreground">${w.amountUSD.toFixed(2)}</div>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(w.status)} className="capitalize">{w.status}</Badge>
                </TableCell>
                {!isUserView && (
                    <TableCell className="text-right">
                        {w.status === 'Pending' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStatusChange(w.id, 'Completed')}>
                                        <CheckCircle className="mr-2 h-4 w-4"/>
                                        <span>Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(w.id, 'Rejected')} className="text-destructive focus:text-destructive">
                                        <XCircle className="mr-2 h-4 w-4"/>
                                        <span>Reject</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </TableCell>
                )}
              </TableRow>
            )}) : (
              <TableRow>
                <TableCell colSpan={isUserView ? 4 : 6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
