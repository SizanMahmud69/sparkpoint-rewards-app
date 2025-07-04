
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
import { Calendar, HeartCrack, VenetianMask, RotateCw, PlusCircle, Coins, Gift, Dices, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddTaskDialog } from './AddTaskDialog';
import { updateTask, addTask, deleteTask } from '@/lib/storage';
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
import { useToast } from '@/hooks/use-toast';


const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Calendar,
  HeartCrack,
  VenetianMask,
  RotateCw,
  Gift,
  Dices,
};

interface TaskTableProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

export function TaskTable({ tasks, onTaskUpdate }: TaskTableProps) {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const { toast } = useToast();

  const handleTaskUpdate = async (id: string, data: Partial<Task>) => {
    await updateTask(id, data);
    onTaskUpdate();
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id'>) => {
    await addTask(newTaskData);
    onTaskUpdate();
  };

  const openDeleteConfirm = (task: Task) => {
    setTaskToDelete(task);
    setIsAlertOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete.id);
    toast({
      title: 'Task Deleted',
      description: `Task "${taskToDelete.title}" has been permanently removed.`,
      variant: 'destructive',
    });
    onTaskUpdate();
    setIsAlertOpen(false);
    setTaskToDelete(null);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>Manage user-facing tasks and their point values.</CardDescription>
              </div>
              <Button onClick={() => setIsAddTaskDialogOpen(true)}>
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
                <TableHead className="w-[120px]">Daily Limit</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const Icon = iconMap[task.icon] || Gift;
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
                        defaultValue={task.points}
                        onBlur={(e) => handleTaskUpdate(task.id, { points: e.target.value })}
                        className="max-w-[150px] pl-8"
                        aria-label={`Points for ${task.title}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={task.limitPerDay}
                      onBlur={(e) => handleTaskUpdate(task.id, { limitPerDay: Number(e.target.value) })}
                      className="max-w-[100px]"
                      aria-label={`Daily limit for ${task.title}`}
                      min="1"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Switch
                        id={`task-switch-${task.id}`}
                        checked={task.enabled}
                        onCheckedChange={(checked) => handleTaskUpdate(task.id, { enabled: checked })}
                        aria-label={`Toggle ${task.title}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(task)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete Task</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onAddTask={handleAddTask}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "<span className="font-bold">{taskToDelete?.title}</span>".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
