
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
import type { PaymentMethod } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const paymentMethodSchema = z.object({
  value: z.string().min(1, "Method name is required."),
  label: z.string().min(1, "Input label is required."),
  placeholder: z.string().min(1, "Placeholder is required."),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMethod: (method: Omit<PaymentMethod, 'id'>) => void;
}

export function AddPaymentMethodDialog({ open, onOpenChange, onAddMethod }: AddPaymentMethodDialogProps) {
  const { toast } = useToast();
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      value: '',
      label: '',
      placeholder: '',
    },
  });

  const onSubmit = (data: PaymentMethodFormValues) => {
    const newMethod: Omit<PaymentMethod, 'id'> = { ...data, enabled: true };
    onAddMethod(newMethod);
    toast({
      title: 'Method Added',
      description: `The "${data.value}" payment method has been added.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Payment Method</DialogTitle>
          <DialogDescription>
            Enter the details for the new withdrawal method. It will be enabled by default.
          </DialogDescription>
        </DialogHeader>
        <form id="add-method-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
                <Input id="value" {...form.register('value')} className="w-full" />
                {form.formState.errors.value && <p className="text-sm text-destructive mt-1">{form.formState.errors.value.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
             <div className="col-span-3">
                <Input id="label" {...form.register('label')} className="w-full" />
                {form.formState.errors.label && <p className="text-sm text-destructive mt-1">{form.formState.errors.label.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="placeholder" className="text-right">
              Placeholder
            </Label>
             <div className="col-span-3">
                <Input id="placeholder" {...form.register('placeholder')} className="w-full" />
                {form.formState.errors.placeholder && <p className="text-sm text-destructive mt-1">{form.formState.errors.placeholder.message}</p>}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-method-form">Add Method</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
