
export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  points: number;
  registrationDate: string;
  status: 'Active' | 'Suspended';
  avatar?: string;
};

export type Withdrawal = {
  id: number;
  userId: number;
  userName: string;
  amountPoints: number;
  amountUSD: number;
  method: 'বিকাশ' | 'নগদ' | 'Binance ID' | 'USDT (TRC-20)';
  details: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Rejected';
};

export type PointTransaction = {
  id: number;
  task: string;
  points: number;
  date: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  points: string;
  icon: string;
  color: string;
  actionText: string;
  enabled: boolean;
};

export type PaymentMethod = {
  value: string;
  label: string;
  placeholder: string;
  enabled: boolean;
};
