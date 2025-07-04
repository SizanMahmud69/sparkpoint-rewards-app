
"use client";

import { useState, useEffect } from 'react';
import { TaskCard } from '@/components/user/TaskCard';
import { Coins, Trophy, Dices } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpinWheelTask } from '@/components/user/SpinWheelTask';
import { useUserPoints } from '@/context/UserPointsContext';
import { getTasks } from '@/lib/storage';
import type { Task } from '@/lib/types';

export default function DashboardPage() {
  const { user, points } = useUserPoints();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);
  
  const enabledTasks = tasks.filter(task => task.enabled);
  const spinWheelTask = enabledTasks.find(task => task.icon === 'Dices');
  const otherTasks = enabledTasks.filter(task => task.icon !== 'Dices');


  return (
    <div className="space-y-8">
      {/* Welcome and Stats Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-tr from-primary/80 to-primary text-primary-foreground shadow-lg">
        <h1 className="text-4xl font-bold font-headline">Welcome Back, {user?.name.split(' ')[0] || 'User'}!</h1>
        <p className="mt-2 text-lg text-primary-foreground/80">Ready to earn some more points today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <Coins className="h-5 w-5 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-headline">{points.toLocaleString()} Points</div>
                  <p className="text-xs text-muted-foreground">Equivalent to ${(points / 1000).toFixed(2)}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Points Earned Today</CardTitle>
                  <Trophy className="h-5 w-5 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-headline">+75 Points</div>
                  <p className="text-xs text-muted-foreground">From 3 completed tasks</p>
              </CardContent>
          </Card>
      </div>

      {/* Available Tasks Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Available Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
        {spinWheelTask && (
            <SpinWheelTask />
        )}
      </section>

    </div>
  );
}
