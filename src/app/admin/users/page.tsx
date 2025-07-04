
"use client";

import { useState, useEffect } from 'react';
import { UserTable } from '@/components/admin/UserTable';
import { getUsers } from '@/lib/storage';
import type { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">User Management</h1>
      <div>
        <UserTable users={users} onUsersUpdate={fetchUsers} />
      </div>
    </div>
  );
}
