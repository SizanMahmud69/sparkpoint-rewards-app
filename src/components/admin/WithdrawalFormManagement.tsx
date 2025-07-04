"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog';
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

export function WithdrawalFormManagement({ initialMethods }: { initialMethods: PaymentMethod[] }) {
  const [methods, setMethods] = React.useState(initialMethods);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [methodToDelete, setMethodToDelete] = React.useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  const handleEnabledChange = (value: string, enabled: boolean) => {
    // In a real app, you'd make an API call here.
    setMethods(methods.map(method => method.value === value ? { ...method, enabled } : method));
  };

  const handleAddMethod = (newMethod: PaymentMethod) => {
    // In a real app, you'd make an API call here to persist the new method.
    setMethods(prevMethods => [...prevMethods, newMethod]);
  };

  const openDeleteConfirm = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setIsAlertOpen(true);
  };

  const handleDeleteMethod = () => {
    if (!methodToDelete) return;
    // In a real app, you'd make an API call here to delete the method.
    setMethods(methods.filter(method => method.value !== methodToDelete.value));
    toast({
      title: 'Method Deleted',
      description: `The "${methodToDelete.value}" payment method has been removed.`,
      variant: 'destructive'
    });
    setIsAlertOpen(false);
    setMethodToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Withdrawal Method Management</CardTitle>
              <CardDescription>Enable, disable, or delete payment methods available to users.</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Input Label</TableHead>
                <TableHead className="hidden sm:table-cell">Input Placeholder</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.value}>
                  <TableCell className="font-medium">{method.value}</TableCell>
                  <TableCell className="text-muted-foreground">{method.label}</TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{method.placeholder}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-3">
                      <Badge variant={method.enabled ? 'default' : 'secondary'} className="capitalize w-[80px] justify-center">
                        {method.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={method.enabled}
                        onCheckedChange={(checked) => handleEnabledChange(method.value, checked)}
                        aria-label={`Toggle ${method.label}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(method)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete Method</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddPaymentMethodDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddMethod={handleAddMethod}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <span className="font-bold"> {methodToDelete?.value} </span> 
              payment method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMethodToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMethod} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
