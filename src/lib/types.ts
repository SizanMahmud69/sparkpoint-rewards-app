

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  points: number;
  registrationDate: string;
  status: 'Active' | 'Suspended' | 'Frozen';
  avatar?: string;
};

export type Withdrawal = {
  id:string;
  userId: string;
  userName: string;
  amountPoints: number;
  amountUSD: number;
  method: 'বিকাশ' | 'নগদ' | 'Binance ID' | 'USDT (TRC-20)';
  details: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Rejected';
};

export type PointTransaction = {
  id: string;
  userId: string;
  task: string;
  points: number;
  date: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  points: string;
  icon: string;
  color: string;
  actionText: string;
  enabled: boolean;
  limitPerDay?: number;
};

export type PaymentMethod = {
  id: string;
  value: string;
  label: string;
  placeholder: string;
  enabled: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  date: string;
};

export type UserTaskCompletion = {
  id: string;
  userId: string;
  taskId: string;
  firstCompletionTimestamp: string;
  count: number;
  lastEarnedPoints?: number;
};

export type SiteContent = {
  id?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  privacyPolicy: string;
};
