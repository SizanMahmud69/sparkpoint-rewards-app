"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog';

export function WithdrawalFormManagement({ initialMethods }: { initialMethods: PaymentMethod[] }) {
  const [methods, setMethods] = React.useState(initialMethods);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleEnabledChange = (value: string, enabled: boolean) => {
    // In a real app, you'd make an API call here.
    setMethods(methods.map(method => method.value === value ? { ...method, enabled } : method));
  };

  const handleAddMethod = (newMethod: PaymentMethod) => {
    // In a real app, you'd make an API call here to persist the new method.
    setMethods(prevMethods => [...prevMethods, newMethod]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Withdrawal Method Management</CardTitle>
              <CardDescription>Enable or disable payment methods available to users.</CardDescription>
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
                <TableHead>Input Placeholder</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.value}>
                  <TableCell className="font-medium">{method.value}</TableCell>
                  <TableCell className="text-muted-foreground">{method.label}</TableCell>
                  <TableCell className="text-muted-foreground">{method.placeholder}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-3">
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
    </>
  );
}
