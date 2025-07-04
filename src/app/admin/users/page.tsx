import { UserTable } from '@/components/admin/UserTable';
import { mockUsers } from '@/lib/data';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">User Management</h1>
      <div>
        <UserTable users={mockUsers} />
      </div>
    </div>
  );
}
