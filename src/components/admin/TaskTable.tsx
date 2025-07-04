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
import type { LucideProps } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, HeartCrack, VenetianMask, RotateCw, PlusCircle, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Calendar,
  HeartCrack,
  VenetianMask,
  RotateCw,
};

export function TaskTable({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = React.useState(initialTasks);

  const handleEnabledChange = (id: number, enabled: boolean) => {
    // In a real app, you'd make an API call here to update the task status.
    setTasks(tasks.map(task => task.id === id ? { ...task, enabled } : task));
  };

  const handlePointsChange = (id: number, points: string) => {
    // In a real app, you'd make an API call here to update the task points.
    setTasks(tasks.map(task => task.id === id ? { ...task, points } : task));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Manage user-facing tasks and their point values.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Task
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[180px]">Points</TableHead>
              <TableHead className="text-right w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const Icon = iconMap[task.icon];
              return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className={cn("p-2 rounded-lg text-white", task.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <span>{task.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{task.description}</TableCell>
                <TableCell>
                  <div className="relative">
                     <Coins className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      value={task.points}
                      onChange={(e) => handlePointsChange(task.id, e.target.value)}
                      className="max-w-[150px] pl-8"
                      aria-label={`Points for ${task.title}`}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-3">
                     <Badge variant={task.enabled ? 'default' : 'secondary'} className="capitalize w-[70px] justify-center">
                      {task.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      id={`task-switch-${task.id}`}
                      checked={task.enabled}
                      onCheckedChange={(checked) => handleEnabledChange(task.id, checked)}
                      aria-label={`Toggle ${task.title}`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
