
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Coins } from 'lucide-react';
import { getMinWithdrawal, saveMinWithdrawal } from '@/lib/storage';
import { Skeleton } from '../ui/skeleton';

const settingsSchema = z.object({
  minWithdrawal: z.coerce.number().min(0, "Minimum must be a positive number."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function WithdrawalSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchMinWithdrawal = async () => {
      setLoading(true);
      const currentMin = await getMinWithdrawal();
      form.reset({ minWithdrawal: currentMin });
      setLoading(false);
    }
    fetchMinWithdrawal();
  }, [form]);


  const onSubmit = async (data: SettingsFormValues) => {
    await saveMinWithdrawal(data.minWithdrawal);
    toast({
      title: 'Settings Saved',
      description: `Minimum withdrawal points set to ${data.minWithdrawal.toLocaleString()}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Settings</CardTitle>
        <CardDescription>Configure global withdrawal settings for all users.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-24" />
            </div>
        ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="minWithdrawal">Minimum Withdrawal Points</Label>
                <div className="relative">
                <Coins className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="minWithdrawal"
                    type="number"
                    placeholder="e.g., 1000"
                    className="pl-8"
                    {...form.register('minWithdrawal')}
                />
                </div>
                {form.formState.errors.minWithdrawal && (
                <p className="text-sm text-destructive">{form.formState.errors.minWithdrawal.message}</p>
                )}
            </div>
            <Button type="submit">Save Settings</Button>
            </form>
        )}
      </CardContent>
    </Card>
  );
}
