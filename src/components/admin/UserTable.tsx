
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AddUserDialog } from './AddUserDialog';
import { getUsers, saveUsers } from '@/lib/storage';

const getStatusBadgeVariant = (status: User['status']): "default" | "destructive" => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Suspended':
      return 'destructive';
  }
};

interface UserTableProps {
  users: User[];
  onUsersUpdate: () => void;
}

export function UserTable({ users, onUsersUpdate }: UserTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);

  const handleStatusChange = (id: number, newStatus: User['status']) => {
    const currentUsers = getUsers();
    const updatedUsers = currentUsers.map(u => u.id === id ? { ...u, status: newStatus } : u);
    saveUsers(updatedUsers);
    onUsersUpdate();
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'registrationDate' | 'avatar'>) => {
    const currentUsers = getUsers();
    const userWithId: User = {
      ...newUser,
      id: currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id)) + 1 : 1,
      registrationDate: new Date().toISOString().split('T')[0],
      avatar: 'https://placehold.co/100x100.png',
    };
    saveUsers([...currentUsers, userWithId]);
    onUsersUpdate();
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
              {filteredUsers.map((user) => (
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
                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{user.points.toLocaleString()}</TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                         {user.status === 'Active' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Suspended')}>
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Active')}>
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddUserDialog 
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
      />
    </>
  );
}
