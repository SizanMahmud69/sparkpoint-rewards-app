
"use client";

import { useState, useEffect } from 'react';
import { WithdrawalFormManagement } from '@/components/admin/WithdrawalFormManagement';
import { WithdrawalSettings } from '@/components/admin/WithdrawalSettings';
import { TaskTable } from '@/components/admin/TaskTable';
import type { PaymentMethod, Task } from '@/lib/types';
import { getPaymentMethods, getTasks } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWithdrawalData = async () => {
    setPaymentMethods(await getPaymentMethods());
  };
  
  const refreshTaskData = async () => {
    setTasks(await getTasks());
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([refreshWithdrawalData(), refreshTaskData()]);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Admin Settings</h1>
        <p className="text-muted-foreground">Manage application-wide settings from one place.</p>
      </div>
      
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Task Settings</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
            {loading ? <Skeleton className="h-64 w-full" /> : <TaskTable tasks={tasks} onTaskUpdate={refreshTaskData} />}
        </TabsContent>
        <TabsContent value="withdrawals" className="mt-6">
          <div className="space-y-8">
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2">
                  {loading ? <Skeleton className="h-64 w-full" /> : (
                    <WithdrawalFormManagement 
                      initialMethods={paymentMethods}
                      onMethodsUpdate={refreshWithdrawalData}
                    />
                  )}
                </div>
                <div className="xl:col-span-1">
                  <WithdrawalSettings />
                </div>
              </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
