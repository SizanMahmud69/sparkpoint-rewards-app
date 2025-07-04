import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { mockWithdrawals } from '@/lib/data';

export default function AdminWithdrawalsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Withdrawal Requests</h1>
      <div>
        <WithdrawalTable withdrawals={mockWithdrawals} />
      </div>
    </div>
  );
}
