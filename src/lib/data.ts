import type { User, Withdrawal, PointTransaction } from './types';

export const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', points: 1250, registrationDate: '2023-10-01' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', points: 780, registrationDate: '2023-10-05' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', points: 2400, registrationDate: '2023-10-12' },
];

export const mockWithdrawals: Withdrawal[] = [
  { id: 1, userId: 1, userName: 'Alice Johnson', amountPoints: 1000, amountUSD: 1, method: 'বিকাশ', details: '01700000000', date: '2023-11-01', status: 'Completed' },
  { id: 2, userId: 3, userName: 'Charlie Brown', amountPoints: 2000, amountUSD: 2, method: 'Binance ID', details: '123456789', date: '2023-11-05', status: 'Pending' },
  { id: 3, userId: 2, userName: 'Bob Smith', amountPoints: 500, amountUSD: 0.5, method: 'নগদ', details: '01800000000', date: '2023-11-06', status: 'Rejected' },
];

export const mockPointHistory: PointTransaction[] = [
    { id: 1, task: 'Registration Bonus', points: 50, date: '2023-11-10' },
    { id: 2, task: 'Daily Login Reward', points: 20, date: '2023-11-10' },
    { id: 3, task: 'Spin & Win', points: 15, date: '2023-11-09' },
    { id: 4, task: 'Scratch & Win', points: 30, date: '2023-11-09' },
    { id: 5, task: 'Crack Your Heart', points: 5, date: '2023-11-09' },
];
