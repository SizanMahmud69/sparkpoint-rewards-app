import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { WithdrawalFormManagement } from '@/components/admin/WithdrawalFormManagement';
import { mockWithdrawals, mockPaymentMethods } from '@/lib/data';

export default function AdminWithdrawalsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Withdrawal Management</h1>
      <WithdrawalFormManagement initialMethods={mockPaymentMethods} />
      <WithdrawalTable withdrawals={mockWithdrawals} />
    </div>
  );
}
