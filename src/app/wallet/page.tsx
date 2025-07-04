import { UserHeader } from "@/components/user/UserHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PointsHistoryTable } from "@/components/user/PointsHistoryTable";
import { WithdrawalForm } from "@/components/user/WithdrawalForm";
import { mockPointHistory, mockWithdrawals } from "@/lib/data";
import { Coins, DollarSign } from 'lucide-react';
import { WithdrawalTable } from "@/components/admin/WithdrawalTable";

export default function WalletPage() {
  const userWithdrawals = mockWithdrawals.filter(w => w.userId === 1 || w.userId === 2 || w.userId === 3);
  const minWithdrawalPoints = 1000; // This would be fetched from settings in a real app

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow bg-muted/20">
          <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold font-headline">My Wallet</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="h-6 w-6 text-primary"/>
                        Current Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold font-headline">1,250 <span className="text-xl font-medium text-muted-foreground">Points</span></p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg bg-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary"/>
                        Point Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">1,000 Points = $1 USD</p>
                      <p className="text-muted-foreground text-sm">Your current balance is worth approximately $1.25</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Tabs defaultValue="withdraw" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="withdraw">Withdraw Points</TabsTrigger>
                      <TabsTrigger value="points-history">Points History</TabsTrigger>
                      <TabsTrigger value="withdrawal-history">Withdrawal History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="withdraw">
                      <WithdrawalForm minWithdrawalPoints={minWithdrawalPoints} />
                    </TabsContent>
                    <TabsContent value="points-history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Points History</CardTitle>
                                <CardDescription>A log of all points you have earned.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PointsHistoryTable transactions={mockPointHistory} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="withdrawal-history">
                        <WithdrawalTable withdrawals={userWithdrawals} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
