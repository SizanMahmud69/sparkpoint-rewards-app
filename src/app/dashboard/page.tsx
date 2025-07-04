import { TaskCard } from '@/components/user/TaskCard';
import { Gift } from 'lucide-react';
import { mockTasks } from '@/lib/data';

export default function DashboardPage() {
  const enabledTasks = mockTasks.filter(task => task.enabled);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">Complete tasks to earn points and redeem rewards.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enabledTasks.map((task) => (
          <TaskCard key={task.title} {...task} />
        ))}
      </div>

      <div className="p-6 bg-card rounded-xl shadow-md border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Registration Bonus</h2>
            <p className="text-muted-foreground">You received <span className="font-bold text-primary">50 points</span> for signing up. Welcome aboard!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
