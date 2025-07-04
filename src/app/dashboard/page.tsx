import { TaskCard } from '@/components/user/TaskCard';
import { Gift, Coins, Trophy } from 'lucide-react';
import { mockTasks } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const enabledTasks = mockTasks.filter(task => task.enabled);

  return (
    <div className="space-y-8">
      {/* Welcome and Stats Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-tr from-primary/80 to-primary text-primary-foreground shadow-lg">
        <h1 className="text-4xl font-bold font-headline">Welcome Back, John!</h1>
        <p className="mt-2 text-lg text-primary-foreground/80">Ready to earn some more points today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <Coins className="h-5 w-5 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-headline">1,250 Points</div>
                  <p className="text-xs text-muted-foreground">Equivalent to $1.25</p>
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
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Available Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enabledTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </div>
      
      {/* Registration Bonus Alert */}
      <Alert className="border-accent bg-accent/10 text-accent-foreground">
        <Gift className="h-4 w-4 stroke-current" />
        <AlertTitle className="font-headline text-accent">Registration Bonus!</AlertTitle>
        <AlertDescription>
          You received <span className="font-bold">50 points</span> for signing up. Welcome aboard!
        </AlertDescription>
      </Alert>

    </div>
  );
}
