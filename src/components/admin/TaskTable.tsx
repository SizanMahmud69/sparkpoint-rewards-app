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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/lib/types';
import { Label } from '../ui/label';

export function TaskTable({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = React.useState(initialTasks);

  const handleEnabledChange = (id: number, enabled: boolean) => {
    // In a real app, you'd make an API call here to update the task status.
    // For this mock, we just update the local state.
    console.log(`Task ${id} status changed to: ${enabled}`);
    setTasks(tasks.map(task => task.id === id ? { ...task, enabled } : task));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
        <CardDescription>Manage user-facing tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Points</TableHead>
              <TableHead className="text-right">Status (Enabled/Disabled)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.points}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Label htmlFor={`task-switch-${task.id}`} className="sr-only">
                      {task.enabled ? 'Disable' : 'Enable'} {task.title}
                    </Label>
                    <Switch
                      id={`task-switch-${task.id}`}
                      checked={task.enabled}
                      onCheckedChange={(checked) => handleEnabledChange(task.id, checked)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
