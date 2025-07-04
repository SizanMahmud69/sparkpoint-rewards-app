import { TaskCard } from '@/components/user/TaskCard';
import { Calendar, Gift, HeartCrack, VenetianMask, RotateCw } from 'lucide-react';

const tasks = [
  {
    title: 'Daily Login Reward',
    description: 'Claim your daily points for logging in.',
    points: 'Up to 70',
    icon: Calendar,
    color: 'bg-blue-500',
    actionText: 'Claim Reward',
  },
  {
    title: 'Scratch & Win',
    description: 'Scratch a card for a surprise reward.',
    points: '10/20/30',
    icon: VenetianMask,
    color: 'bg-green-500',
    actionText: 'Scratch Now',
  },
  {
    title: 'Crack Your Heart',
    description: 'Click the heart to release points.',
    points: '5/10/15',
    icon: HeartCrack,
    color: 'bg-red-500',
    actionText: 'Crack It',
  },
  {
    title: 'Spin & Wheel',
    description: 'Spin the wheel for a chance to win big.',
    points: '5/8/10/15/20',
    icon: RotateCw,
    color: 'bg-yellow-500',
    actionText: 'Spin Wheel',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">Complete tasks to earn points and redeem rewards.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tasks.map((task) => (
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
