import type { User, Withdrawal, PointTransaction, Task, PaymentMethod } from './types';

export const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', points: 1250, registrationDate: '2023-10-01', status: 'Active', avatar: 'https://placehold.co/100x100.png' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', points: 780, registrationDate: '2023-10-05', status: 'Active', avatar: 'https://placehold.co/100x100.png' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', points: 2400, registrationDate: '2023-10-12', status: 'Suspended', avatar: 'https://placehold.co/100x100.png' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', points: 5600, registrationDate: '2023-09-15', status: 'Active', avatar: 'https://placehold.co/100x100.png' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', points: 300, registrationDate: '2023-11-20', status: 'Active', avatar: 'https://placehold.co/100x100.png' },
];

export const mockWithdrawals: Withdrawal[] = [
  { id: 1, userId: 1, userName: 'Alice Johnson', amountPoints: 1000, amountUSD: 1, method: 'বিকাশ', details: '01700000000', date: '2023-11-01 10:30 AM', status: 'Completed' },
  { id: 2, userId: 3, userName: 'Charlie Brown', amountPoints: 2000, amountUSD: 2, method: 'Binance ID', details: '123456789', date: '2023-11-05 02:15 PM', status: 'Pending' },
  { id: 3, userId: 2, userName: 'Bob Smith', amountPoints: 500, amountUSD: 0.5, method: 'নগদ', details: '01800000000', date: '2023-11-06 09:00 AM', status: 'Rejected' },
  { id: 4, userId: 4, userName: 'Diana Prince', amountPoints: 5000, amountUSD: 5, method: 'USDT (TRC-20)', details: 'T...1234', date: '2023-11-20 11:00 AM', status: 'Completed' },
  { id: 5, userId: 5, userName: 'Ethan Hunt', amountPoints: 3000, amountUSD: 3, method: 'বিকাশ', details: '01900000000', date: '2023-11-21 03:45 PM', status: 'Pending' },
];

export const mockPointHistory: PointTransaction[] = [
    { id: 1, task: 'Registration Bonus', points: 50, date: '2023-11-10' },
    { id: 2, task: 'Daily Login Reward', points: 20, date: '2023-11-10' },
    { id: 3, task: 'Spin The Wheel', points: 15, date: '2023-11-09' },
    { id: 4, task: 'Scratch & Win', points: 30, date: '2023-11-09' },
];

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
