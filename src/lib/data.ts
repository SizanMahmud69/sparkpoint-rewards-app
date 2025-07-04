import type { User, Withdrawal, PointTransaction, Task, PaymentMethod, Notification } from './types';

export const mockUsers: User[] = [];

export const mockWithdrawals: Withdrawal[] = [];

export const mockPointHistory: PointTransaction[] = [];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Daily Login Reward',
    description: 'Claim your daily points for logging in.',
    points: 'Up to 70',
    icon: 'Calendar',
    color: 'bg-blue-500',
    actionText: 'Claim Reward',
    enabled: true,
  },
  {
    id: 2,
    title: 'Scratch & Win',
    description: 'Scratch a card for a surprise reward.',
    points: '10/20/30',
    icon: 'VenetianMask',
    color: 'bg-green-500',
    actionText: 'Scratch Now',
    enabled: true,
  },
  {
    id: 4,
    title: 'Spin the Wheel',
    description: 'Try your luck to win big rewards!',
    points: 'Varies',
    icon: 'Dices',
    color: 'bg-purple-500',
    actionText: 'Spin for a Prize',
    enabled: true,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { value: 'বিকাশ', label: 'bKash Account Number', placeholder: 'e.g., 01700000000', enabled: true },
  { value: 'নগদ', label: 'Nagad Account Number', placeholder: 'e.g., 01800000000', enabled: true },
  { value: 'Binance ID', label: 'Binance ID', placeholder: 'e.g., 123456789', enabled: true },
  { value: 'USDT (TRC-20)', label: 'USDT (TRC-20) Address', placeholder: 'e.g., T...', enabled: false },
];

export const mockNotifications: Notification[] = [];
