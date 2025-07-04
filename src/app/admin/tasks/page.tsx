import { TaskTable } from '@/components/admin/TaskTable';
import { mockTasks } from '@/lib/data';

export default function AdminTasksPage() {
  return (
    <div>
      <TaskTable tasks={mockTasks} />
    </div>
  );
}
