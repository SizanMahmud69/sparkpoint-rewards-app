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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                       <div className="p-3 bg-primary/10 rounded-lg">
                          <Coins className="h-8 w-8 text-primary"/>
                       </div>
                       <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                          <p className="text-2xl font-bold font-headline">1,250 Points</p>
                       </div>
                    </CardHeader>
                  </Card>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-primary/5 border-primary/10">
                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <DollarSign className="h-8 w-8 text-primary"/>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Point Value</p>
                        <p className="text-lg font-semibold">1,000 pts = $1 USD</p>
                      </div>
                    </CardHeader>
                     <CardContent className="pt-0 px-5 pb-5">
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
