import { UserHeader } from "@/components/user/UserHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, User, Mail, Calendar } from 'lucide-react';

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
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-5 w-5 text-muted-foreground"/>
                                    <span className="text-sm font-medium">john.doe@example.com</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <Coins className="h-5 w-5 text-muted-foreground"/>
                                    <span className="text-sm font-medium">1,250 Points</span>
                                </div>
                                 <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-muted-foreground"/>
                                    <span className="text-sm font-medium">Joined on October 1, 2023</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
