
"use client";

import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search, RotateCw, FileText, Ban, UserCheck, Trash2, Snowflake } from 'lucide-react';
import type { User, Notification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AddUserDialog } from './AddUserDialog';
import { updateUserStatus, deleteUserAndData, addUser, resetUserTasks, addNotification } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

const getStatusBadgeClass = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return "border-transparent bg-green-500/20 text-green-700 dark:text-green-400";
      case 'Suspended':
        return "border-transparent bg-red-500/20 text-red-600 dark:text-red-400";
      case 'Frozen':
        return "border-transparent bg-blue-500/20 text-blue-700 dark:text-blue-400";
      default:
        return "";
    }
};

const getStatusBadgeVariant = (status: User['status']): "outline" => {
    return 'outline';
};

interface UserTableProps {
  users: User[];
  onUsersUpdate: () => void;
  loading: boolean;
}

export function UserTable({ users, onUsersUpdate, loading }: UserTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false);
  const [userToReset, setUserToReset] = React.useState<User | null>(null);
  const { toast } = useToast();

  const handleStatusChange = async (id: string, name: string, newStatus: User['status']) => {
    await updateUserStatus(id, newStatus);

    const notificationDate = new Date().toISOString();
    let notificationTitle = '';
    let notificationDescription = '';
    let notificationType: Notification['type'] = 'info';

    if (newStatus === 'Frozen') {
        notificationTitle = 'Account Frozen';
        notificationDescription = 'Your account has been temporarily frozen. You cannot complete tasks or make withdrawals.';
        notificationType = 'error';
    } else if (newStatus === 'Suspended') {
        notificationTitle = 'Account Suspended';
        notificationDescription = 'Your account has been suspended and is under review. Please contact support.';
        notificationType = 'error';
    } else if (newStatus === 'Active') {
        notificationTitle = 'Account Reactivated';
        notificationDescription = 'Your account has been reactivated. You can now resume all activities.';
        notificationType = 'success';
    }

    if (notificationTitle) {
        await addNotification({
            userId: id,
            title: notificationTitle,
            description: notificationDescription,
            type: notificationType,
            read: false,
            date: notificationDate,
        });
    }

    toast({
      title: `User ${newStatus}`,
      description: `User "${name}" has been ${newStatus.toLowerCase()}.`
    });
    onUsersUpdate();
  };

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    await deleteUserAndData(userToDelete.id);
    
    toast({
        title: "User Deleted",
        description: `User "${userToDelete.name}" and all associated data have been permanently removed.`,
        variant: "destructive"
    });
    onUsersUpdate();
    setIsAlertOpen(false);
    setUserToDelete(null);
  };

  const handleAddUser = async (newUser: Omit<User, 'id'| 'registrationDate' | 'avatar'>) => {
    const userWithDetails: Omit<User, 'id'> = {
      ...newUser,
      registrationDate: new Date().toISOString(),
      avatar: 'https://placehold.co/100x100.png',
    };
    await addUser(userWithDetails);
    onUsersUpdate();
  };
  
  const openResetConfirm = (user: User) => {
    setUserToReset(user);
    setIsResetAlertOpen(true);
  };

  const handleResetTasks = async () => {
      if (!userToReset) return;
      await resetUserTasks(userToReset.id);
      toast({
          title: "Tasks Reset",
          description: `Daily task limits for "${userToReset.name}" have been reset.`,
      });
      setIsResetAlertOpen(false);
      setUserToReset(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>A list of all users in the system.</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                          placeholder="Search users..." 
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <Button onClick={() => setIsAddUserDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add User
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                 ))
              ) : filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)} className={getStatusBadgeClass(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{user.points.toLocaleString()}</TableCell>
                  <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openResetConfirm(user)}>
                          <RotateCw className="mr-2 h-4 w-4" />
                          <span>Reset Tasks</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         {user.status === 'Active' ? (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.name, 'Frozen')}>
                                <Snowflake className="mr-2 h-4 w-4" />
                                <span>Freeze Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.name, 'Suspended')}>
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Suspend User</span>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.name, 'Active')}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Activate User</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => openDeleteConfirm(user)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddUserDialog 
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <span className="font-bold">{userToDelete?.name}</span> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
               This will reset all daily task completions for <span className="font-bold">{userToReset?.name}</span>. They will be able to complete their daily tasks again immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToReset(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetTasks}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
