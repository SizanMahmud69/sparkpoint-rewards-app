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
import { mockPaymentMethods } from '@/lib/data';
import type { PaymentMethod } from '@/lib/types';
import { History, Loader2 } from 'lucide-react';

const createWithdrawalSchema = (minPoints: number, maxPoints: number) => z.object({
  points: z.coerce
    .number()
    .min(minPoints, { message: `Minimum withdrawal is ${minPoints} points.` })
    .max(maxPoints, { message: `You cannot withdraw more than your balance.` }),
  method: z.string({ required_error: 'Please select a payment method.' }),
  details: z.string().min(1, { message: 'Withdrawal details are required.' }),
});

export type WithdrawalFormValues = z.infer<ReturnType<typeof createWithdrawalSchema>>;

interface WithdrawalFormProps {
    minWithdrawalPoints?: number;
    onHistoryClick: () => void;
    onSubmitRequest: (values: WithdrawalFormValues) => void;
    currentBalance: number;
}

export function WithdrawalForm({ 
  minWithdrawalPoints = 1000, 
  onHistoryClick,
  onSubmitRequest,
  currentBalance
}: WithdrawalFormProps) {
  const paymentMethods = mockPaymentMethods.filter(m => m.enabled);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0] || {} as PaymentMethod);
  const [isLoading, setIsLoading] = useState(false);

  const withdrawalSchema = createWithdrawalSchema(minWithdrawalPoints, currentBalance);
  
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      points: minWithdrawalPoints,
      method: paymentMethods[0]?.value,
      details: '',
    }
  });

  const handleMethodChange = (value: string) => {
    const method = paymentMethods.find(m => m.value === value) || paymentMethods[0];
    setSelectedMethod(method);
    form.setValue('method', value);
    form.clearErrors('method');
  };

  const onSubmit = (data: WithdrawalFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
        onSubmitRequest(data);
        form.reset({ points: minWithdrawalPoints, method: selectedMethod.value, details: '' });
        setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="shadow-lg flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Withdraw Your Points</CardTitle>
            <CardDescription>{`1000 points = $1 USD. Minimum withdrawal is ${minWithdrawalPoints} points.`}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onHistoryClick} className="ml-4 flex-shrink-0">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
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
            <Select onValueChange={handleMethodChange} defaultValue={selectedMethod.value} name={form.name}>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Withdrawal Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
