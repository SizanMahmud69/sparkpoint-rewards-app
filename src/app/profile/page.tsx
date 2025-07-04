"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { UserHeader } from "@/components/user/UserHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Mail, Calendar, Monitor, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const [avatar, setAvatar] = useState("https://placehold.co/100x100.png");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    setAvatar(loadEvent.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

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
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                                                <AvatarImage src={avatar} alt="@user" data-ai-hint="person"/>
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                             <Button
                                                onClick={handleEditClick}
                                                variant="outline"
                                                size="icon"
                                                className="absolute bottom-4 right-0 rounded-full bg-white shadow-md hover:bg-muted"
                                            >
                                                <Camera className="h-5 w-5 text-primary" />
                                                <span className="sr-only">Change profile picture</span>
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
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
