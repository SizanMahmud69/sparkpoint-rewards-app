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
                        
                        <div className="max-w-4xl mx-auto space-y-8">
                            <Card className="shadow-lg overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="bg-primary/10 p-8 flex flex-col items-center text-center">
                                        <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                                            <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="person"/>
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="text-2xl font-headline">John Doe</CardTitle>
                                        <CardDescription>Member since October 1, 2023</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email Address</p>
                                            <p className="font-semibold">john.doe@example.com</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                                         <div className="p-3 bg-primary/10 rounded-lg">
                                            <Coins className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Point Balance</p>
                                            <p className="font-semibold">1,250 Points</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                                         <div className="p-3 bg-primary/10 rounded-lg">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Joined Date</p>
                                            <p className="font-semibold">October 1, 2023</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Monitor className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Device IP</p>
                                            <p className="font-semibold">192.168.1.100</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}