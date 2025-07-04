
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { PaymentMethod, User } from '@/lib/types';
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
    userStatus?: User['status'];
}

export function WithdrawalForm({ 
  paymentMethods,
  minWithdrawalPoints = 1000, 
  onHistoryClick,
  onSubmitRequest,
  currentBalance,
  userStatus
}: WithdrawalFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const withdrawalSchema = createWithdrawalSchema(minWithdrawalPoints, currentBalance);
  
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      points: minWithdrawalPoints,
      method: undefined,
      details: '',
    },
  });

  const methodValue = form.watch('method');

  useEffect(() => {
    const newSelectedMethod = paymentMethods.find(m => m.value === methodValue);
    setSelectedMethod(newSelectedMethod);
  }, [methodValue, paymentMethods]);

  const onSubmit = (data: WithdrawalFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
        onSubmitRequest(data);
        form.reset({
          points: minWithdrawalPoints,
          method: undefined,
          details: ''
        });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points to Withdraw</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={String(minWithdrawalPoints)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <div className="space-y-2">
                <Label htmlFor="amount-usd">Equivalent in USD</Label>
                <Input id="amount-usd" type="text" value={`$${(form.watch('points', minWithdrawalPoints) / 1000 || 0).toFixed(2)}`} disabled />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={paymentMethods.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.value}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMethod && 
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{selectedMethod.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={selectedMethod.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            }

            <Button type="submit" className="w-full" disabled={isLoading || userStatus === 'Frozen'}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {userStatus === 'Frozen' ? 'Account Frozen' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
