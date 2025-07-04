"use client";

import { useState } from 'react';
import { UserHeader } from "@/components/user/UserHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PointsHistoryTable } from "@/components/user/PointsHistoryTable";
import { WithdrawalForm } from "@/components/user/WithdrawalForm";
import { mockPointHistory, mockWithdrawals } from "@/lib/data";
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

export default function WalletPage() {
  const [isPointsHistoryDialogOpen, setIsPointsHistoryDialogOpen] = useState(false);
  const [isWithdrawalHistoryDialogOpen, setIsWithdrawalHistoryDialogOpen] = useState(false);
  const userWithdrawals = mockWithdrawals.filter(w => w.userId === 1 || w.userId === 2 || w.userId === 3);
  const minWithdrawalPoints = 1000; // This would be fetched from settings in a real app

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow bg-muted/20">
          <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
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
                          <p className="text-2xl font-bold font-headline">1,250 Points</p>
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
                        <p className="text-2xl font-bold font-headline">$1.25</p>
                      </div>
                    </CardHeader>
                     <CardContent className="pt-0 px-5 pb-5">
                      <p className="text-muted-foreground text-xs">1,000 points = $1 USD</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-full">
                  <WithdrawalForm 
                    minWithdrawalPoints={minWithdrawalPoints}
                    onHistoryClick={() => setIsWithdrawalHistoryDialogOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
      </main>

      <Dialog open={isPointsHistoryDialogOpen} onOpenChange={setIsPointsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Points History</DialogTitle>
            <DialogDescription>
              A log of all points you have earned.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <PointsHistoryTable transactions={mockPointHistory} />
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
            <WithdrawalTable withdrawals={userWithdrawals} isUserView={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
