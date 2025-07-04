"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockPaymentMethods } from '@/lib/data';
import type { PaymentMethod } from '@/lib/types';

const createWithdrawalSchema = (minPoints: number) => z.object({
  points: z.coerce.number().min(minPoints, { message: `Minimum withdrawal is ${minPoints} points.` }),
  method: z.string({ required_error: 'Please select a payment method.' }),
  details: z.string().min(1, { message: 'Withdrawal details are required.' }),
});

export function WithdrawalForm({ minWithdrawalPoints = 1000 }: { minWithdrawalPoints?: number }) {
  const paymentMethods = mockPaymentMethods.filter(m => m.enabled);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0] || {} as PaymentMethod);
  const { toast } = useToast();

  const withdrawalSchema = createWithdrawalSchema(minWithdrawalPoints);
  type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
  });

  const handleMethodChange = (value: string) => {
    const method = paymentMethods.find(m => m.value === value) || paymentMethods[0];
    setSelectedMethod(method);
    form.setValue('method', value);
  };

  const onSubmit = (data: WithdrawalFormValues) => {
    console.log(data);
    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request for ${data.points} points is being processed.`,
    });
    form.reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Withdraw Your Points</CardTitle>
        <CardDescription>{`1000 points = $1 USD. Minimum withdrawal is ${minWithdrawalPoints} points.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points to Withdraw</Label>
              <Input id="points" type="number" placeholder={String(minWithdrawalPoints)} {...form.register('points')} />
              {form.formState.errors.points && <p className="text-sm text-destructive">{form.formState.errors.points.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="amount-usd">Equivalent in USD</Label>
              <Input id="amount-usd" type="text" value={`$${(form.watch('points') / 1000 || 0).toFixed(2)}`} disabled />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select onValueChange={handleMethodChange} defaultValue={selectedMethod.value}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.value}</SelectItem>)}
              </SelectContent>
            </Select>
            {form.formState.errors.method && <p className="text-sm text-destructive">{form.formState.errors.method.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">{selectedMethod.label}</Label>
            <Input id="details" placeholder={selectedMethod.placeholder} {...form.register('details')} />
            {form.formState.errors.details && <p className="text-sm text-destructive">{form.formState.errors.details.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Submit Withdrawal Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
