import { WithdrawalTable } from '@/components/admin/WithdrawalTable';
import { WithdrawalFormManagement } from '@/components/admin/WithdrawalFormManagement';
import { WithdrawalSettings } from '@/components/admin/WithdrawalSettings';
import { mockWithdrawals, mockPaymentMethods } from '@/lib/data';

export default function AdminWithdrawalsPage() {
  const initialMinWithdrawal = 1000; // This would be fetched from a database in a real app

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Withdrawal Management</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <WithdrawalFormManagement initialMethods={mockPaymentMethods} />
        </div>
        <div className="xl:col-span-1">
          <WithdrawalSettings initialMinWithdrawal={initialMinWithdrawal} />
        </div>
      </div>
      
      <WithdrawalTable withdrawals={mockWithdrawals} />
    </div>
  );
}
