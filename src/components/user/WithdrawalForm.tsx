
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PaymentMethod } from '@/lib/types';
import { History, Loader2 } from 'lucide-react';

const createWithdrawalSchema = (minPoints: number, maxPoints: number) => z.object({
  points: z.coerce
    .number()
    .min(minPoints, { message: `Minimum withdrawal is ${minPoints} points.` })
    .max(maxPoints, { message: `You do not have enough points for this withdrawal.` }),
  method: z.string({ required_error: 'Please select a payment method.' }),
  details: z.string().min(1, { message: 'Withdrawal details are required.' }),
});

export type WithdrawalFormValues = z.infer<ReturnType<typeof createWithdrawalSchema>>;

interface WithdrawalFormProps {
    paymentMethods: PaymentMethod[];
    minWithdrawalPoints?: number;
    onHistoryClick: () => void;
    onSubmitRequest: (values: WithdrawalFormValues) => void;
    currentBalance: number;
}

export function WithdrawalForm({ 
  paymentMethods,
  minWithdrawalPoints = 1000, 
  onHistoryClick,
  onSubmitRequest,
  currentBalance
}: WithdrawalFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const withdrawalSchema = createWithdrawalSchema(minWithdrawalPoints, currentBalance);
  
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
  });

  useEffect(() => {
    if (paymentMethods.length > 0 && !form.getValues('method')) {
      const defaultMethod = paymentMethods[0];
      setSelectedMethod(defaultMethod);
      form.reset({
        points: minWithdrawalPoints,
        method: defaultMethod.value,
        details: ''
      });
    }
  }, [paymentMethods, form, minWithdrawalPoints]);

  const handleMethodChange = (value: string) => {
    const method = paymentMethods.find(m => m.value === value);
    setSelectedMethod(method);
    form.setValue('method', value);
    form.clearErrors('method');
  };

  const onSubmit = (data: WithdrawalFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
        onSubmitRequest(data);
        if (paymentMethods.length > 0) {
            const defaultMethod = paymentMethods[0];
            setSelectedMethod(defaultMethod);
            form.reset({ points: minWithdrawalPoints, method: defaultMethod.value, details: '' });
        }
        setIsLoading(false);
    }, 1000);
  };

  const methodValue = form.watch('method');

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
            <Select onValueChange={handleMethodChange} value={methodValue} name={form.name}>
              <SelectTrigger id="method" disabled={paymentMethods.length === 0}>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.value}</SelectItem>)}
              </SelectContent>
            </Select>
            {form.formState.errors.method && <p className="text-sm text-destructive">{form.formState.errors.method.message}</p>}
          </div>

          {selectedMethod && <div className="space-y-2">
            <Label htmlFor="details">{selectedMethod.label}</Label>
            <Input id="details" placeholder={selectedMethod.placeholder} {...form.register('details')} />
            {form.formState.errors.details && <p className="text-sm text-destructive">{form.formState.errors.details.message}</p>}
          </div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Withdrawal Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
