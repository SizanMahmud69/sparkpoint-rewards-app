
"use client";

import { useState, useEffect } from 'react';
import { TaskTable } from '@/components/admin/TaskTable';
import { getTasks } from '@/lib/storage';
import type { Task } from '@/lib/types';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  return (
    <div>
      <TaskTable tasks={tasks} />
    </div>
  );
}
