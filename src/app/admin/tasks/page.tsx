import { TaskTable } from '@/components/admin/TaskTable';
import { mockTasks } from '@/lib/data';

export default function AdminTasksPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Task Management</h1>
      <p className="text-muted-foreground">
        Enable or disable tasks available for users on their dashboard.
      </p>
      <div>
        <TaskTable tasks={mockTasks} />
      </div>
    </div>
  );
}
