"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(1, "Description is required."),
  points: z.string().min(1, "Points value is required."),
  icon: z.string().min(1, "Lucide icon name is required."),
  color: z.string().min(1, "Tailwind color class is required (e.g., bg-blue-500)."),
  actionText: z.string().min(1, "Action text is required."),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'enabled'>) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const { toast } = useToast();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      points: '',
      icon: 'Gift', // Default icon suggestion
      color: 'bg-green-500', // Default color suggestion
      actionText: 'Complete Task',
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    onAddTask(data);
    toast({
      title: 'Task Added',
      description: `Task "${data.title}" has been created successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Enter the details for the new task. It will be enabled by default.
          </DialogDescription>
        </DialogHeader>
        <form id="add-task-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} placeholder="e.g., Daily Login" />
            {form.formState.errors.title && <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register('description')} placeholder="e.g., Claim your daily bonus." />
            {form.formState.errors.description && <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input id="points" {...form.register('points')} placeholder="e.g., 10/20/30 or 50" />
              {form.formState.errors.points && <p className="text-sm text-destructive mt-1">{form.formState.errors.points.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="actionText">Action Text</Label>
              <Input id="actionText" {...form.register('actionText')} placeholder="e.g., Claim Now" />
              {form.formState.errors.actionText && <p className="text-sm text-destructive mt-1">{form.formState.errors.actionText.message}</p>}
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input id="icon" {...form.register('icon')} placeholder="e.g., Calendar (from Lucide)" />
              {form.formState.errors.icon && <p className="text-sm text-destructive mt-1">{form.formState.errors.icon.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="color">Color Class</Label>
              <Input id="color" {...form.register('color')} placeholder="e.g., bg-blue-500" />
              {form.formState.errors.color && <p className="text-sm text-destructive mt-1">{form.formState.errors.color.message}</p>}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-task-form">Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
