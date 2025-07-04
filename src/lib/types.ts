export type User = {
  id: number;
  name: string;
  email: string;
  points: number;
  registrationDate: string;
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
