import { UserHeader } from "@/components/user/UserHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Mail, Calendar, Monitor } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <UserHeader />
            <main className="flex-grow bg-muted/20">
                <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                        <Card className="max-w-2xl mx-auto shadow-lg">
                            <CardHeader className="items-center text-center">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="person"/>
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-2xl font-headline">John Doe</CardTitle>
                                <CardDescription>Member since 2023-10-01</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                        <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Email Address</h4>
                                            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                        <Coins className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Point Balance</h4>
                                            <p className="text-sm text-muted-foreground">1,250 Points</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                        <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Joined Date</h4>
                                            <p className="text-sm text-muted-foreground">October 1, 2023</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                        <Monitor className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Device IP</h4>
                                            <p className="text-sm text-muted-foreground">192.168.1.100</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
