
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
import type { Withdrawal, User } from '@/lib/types';
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
import { Skeleton } from '../ui/skeleton';


export function WithdrawalTable({
  withdrawals,
  users,
  isUserView = false,
  onStatusChange,
  loading = false,
}: {
  withdrawals: Withdrawal[];
  users: User[];
  isUserView?: boolean;
  onStatusChange?: (id: string, newStatus: Withdrawal['status']) => void;
  loading?: boolean;
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const userMap = React.useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

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

  const filteredWithdrawals = !isUserView
    ? withdrawals.filter(w => {
      const user = userMap.get(w.userId);
      const matchesSearch = (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.details.toLowerCase().includes(searchTerm.toLowerCase()));
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
            {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        {!isUserView && <TableCell><Skeleton className="h-5 w-32" /></TableCell>}
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                        {!isUserView && <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>}
                    </TableRow>
                ))
            ) : filteredWithdrawals.length > 0 ? filteredWithdrawals.map((w) => {
              const user = userMap.get(w.userId);
              const withdrawalDate = new Date(w.date);
              return (
              <TableRow key={w.id}>
                <TableCell className="hidden md:table-cell">
                  <div className="font-mono text-sm">{withdrawalDate.toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground font-mono">{withdrawalDate.toLocaleTimeString()}</div>
                </TableCell>
                {!isUserView && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 hidden sm:flex">
                          <AvatarImage src={user?.avatar} alt={user?.name} data-ai-hint="person face" />
                          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {w.userId.substring(0,6)}...</div>
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
                    <Badge variant="outline" className={getStatusBadgeClass(w.status)}>
                        {w.status}
                    </Badge>
                </TableCell>
                {!isUserView && (
                    <TableCell className="text-right">
                        {w.status === 'Pending' && onStatusChange && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onStatusChange(w.id, 'Completed')}>
                                        <CheckCircle className="mr-2 h-4 w-4"/>
                                        <span>Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onStatusChange(w.id, 'Rejected')} className="text-destructive focus:text-destructive">
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
