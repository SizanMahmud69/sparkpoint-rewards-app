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
import { PlusCircle } from 'lucide-react';

export function PointsHistoryTable({ transactions }: { transactions: PointTransaction[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.task}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell className="text-right">
              <Badge variant="default" className='bg-accent hover:bg-accent/90 text-accent-foreground'>
                <PlusCircle className="mr-1 h-3 w-3" />
                {transaction.points}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
