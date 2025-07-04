
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PointsHistoryTable } from "@/components/user/PointsHistoryTable";
import { WithdrawalForm, type WithdrawalFormValues } from "@/components/user/WithdrawalForm";
import { Coins, DollarSign, History } from 'lucide-react';
import { WithdrawalTable } from "@/components/admin/WithdrawalTable";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { PointTransaction, Withdrawal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUserPoints } from '@/context/UserPointsContext';
import { getWithdrawals, saveWithdrawals, getUsers, getPointHistoryForUser, getPaymentMethods } from '@/lib/storage';

export default function WalletPage() {
  const { toast } = useToast();
  const { user, points, updatePoints } = useUserPoints();

  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [allUsers, setAllUsers] = useState(getUsers());

  useEffect(() => {
    if (user) {
      setWithdrawalHistory(getWithdrawals().filter(w => w.userId === user.id));
      setPointHistory(getPointHistoryForUser(user.id));
    }
  }, [user]);

  const [isPointsHistoryDialogOpen, setIsPointsHistoryDialogOpen] = useState(false);
  const [isWithdrawalHistoryDialogOpen, setIsWithdrawalHistoryDialogOpen] = useState(false);
  
  const minWithdrawalPoints = 1000;

  const handleWithdrawalRequest = (data: WithdrawalFormValues) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to make a withdrawal." });
      return;
    }

    if (data.points > points) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You do not have enough points to make this withdrawal.",
      });
      return;
    }

    updatePoints(-data.points);

    const newWithdrawal: Withdrawal = {
      id: Math.random(),
      userId: user.id,
      userName: user.name,
      amountPoints: data.points,
      amountUSD: data.points / 1000,
      method: data.method as any,
      details: data.details,
      date: new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      status: 'Pending',
    };

    const allWithdrawals = getWithdrawals();
    saveWithdrawals([newWithdrawal, ...allWithdrawals]);
    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);

    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request for ${data.points.toLocaleString()} points is being processed.`,
    });
  };


  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">My Wallet</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 p-5">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Coins className="h-8 w-8 text-primary"/>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold font-headline">{points.toLocaleString()} Points</p>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow p-0" />
              <CardFooter className="p-5 pt-0">
                <Button variant="outline" className="w-full" onClick={() => setIsPointsHistoryDialogOpen(true)}>
                    <History className="mr-2 h-4 w-4" />
                    View History
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-primary/5 border-primary/10">
              <CardHeader className="flex flex-row items-center gap-4 p-5">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-8 w-8 text-primary"/>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approximate Value</p>
                  <p className="text-2xl font-bold font-headline">${(points / 1000).toFixed(2)}</p>
                </div>
              </CardHeader>
                <CardContent className="pt-0 px-5 pb-5">
                <p className="text-muted-foreground text-xs">1,000 points = $1 USD</p>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <WithdrawalForm 
              paymentMethods={getPaymentMethods().filter(m => m.enabled)}
              minWithdrawalPoints={minWithdrawalPoints}
              onHistoryClick={() => setIsWithdrawalHistoryDialogOpen(true)}
              onSubmitRequest={handleWithdrawalRequest}
              currentBalance={points}
            />
          </div>
        </div>
      </div>

      <Dialog open={isPointsHistoryDialogOpen} onOpenChange={setIsPointsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Points History</DialogTitle>
            <DialogDescription>
              A log of all points you have earned.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <PointsHistoryTable transactions={pointHistory} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawalHistoryDialogOpen} onOpenChange={setIsWithdrawalHistoryDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Withdrawal History</DialogTitle>
            <DialogDescription>
              A log of all your withdrawal requests.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <WithdrawalTable withdrawals={withdrawalHistory} users={allUsers} isUserView={true} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
