
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { PointTransaction } from '@/lib/types';
import { PlusCircle, MinusCircle, RotateCw } from 'lucide-react';

export function PointsHistoryTable({ transactions }: { transactions: PointTransaction[] }) {
  const getBadge = (transaction: PointTransaction) => {
    const isRefund = transaction.task.toLowerCase().includes('refund');
    
    if (isRefund && transaction.points > 0) {
      return (
        <Badge variant="outline" className="border-transparent bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-medium">
          <RotateCw className="mr-1 h-3 w-3" />
          +{transaction.points}
        </Badge>
      );
    }

    if (transaction.points >= 0) {
      return (
        <Badge variant="outline" className="border-transparent bg-green-500/20 text-green-700 dark:text-green-400 font-medium">
          <PlusCircle className="mr-1 h-3 w-3" />
          +{transaction.points}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-transparent bg-red-500/20 text-red-600 dark:text-red-400 font-medium">
        <MinusCircle className="mr-1 h-3 w-3" />
        {transaction.points}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task / Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.task}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell className="text-right">
                {getBadge(transaction)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              No points history found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
