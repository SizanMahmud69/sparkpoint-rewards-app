
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
import { updatePaymentMethod, addPaymentMethod, deletePaymentMethod } from '@/lib/storage';

interface WithdrawalFormManagementProps {
  initialMethods: PaymentMethod[];
  onMethodsUpdate: () => void;
}

export function WithdrawalFormManagement({ initialMethods, onMethodsUpdate }: WithdrawalFormManagementProps) {
  const [methods, setMethods] = React.useState(initialMethods);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [methodToDelete, setMethodToDelete] = React.useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setMethods(initialMethods);
  }, [initialMethods]);

  const handleEnabledChange = async (id: string, enabled: boolean) => {
    await updatePaymentMethod(id, { enabled });
    onMethodsUpdate();
  };

  const handleAddMethod = async (newMethodData: Omit<PaymentMethod, 'id'>) => {
    await addPaymentMethod(newMethodData);
    onMethodsUpdate();
  };

  const openDeleteConfirm = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setIsAlertOpen(true);
  };

  const handleDeleteMethod = async () => {
    if (!methodToDelete) return;
    await deletePaymentMethod(methodToDelete.id);
    toast({
      title: 'Method Deleted',
      description: `The "${methodToDelete.value}" payment method has been removed.`,
      variant: 'destructive'
    });
    setIsAlertOpen(false);
    setMethodToDelete(null);
    onMethodsUpdate();
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
                <TableRow key={method.id}>
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
                        onCheckedChange={(checked) => handleEnabledChange(method.id, checked)}
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
