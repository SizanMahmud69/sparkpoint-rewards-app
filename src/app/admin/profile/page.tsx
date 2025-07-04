
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield } from 'lucide-react';

export default function AdminProfilePage() {

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Admin Profile</h1>
            
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="bg-primary/10 p-8 flex flex-col items-center text-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                                    <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="person"/>
                                    <AvatarFallback>{'A'}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-2xl font-headline">Admin User</CardTitle>
                            <CardDescription>System Administrator</CardDescription>
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
                                <p className="font-semibold">admin@spark.point</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 p-5">
                             <div className="p-3 bg-primary/10 rounded-lg">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="font-semibold">Administrator</p>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}
