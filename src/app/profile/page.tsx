
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Mail, Calendar, Monitor, Camera, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUserPoints } from "@/context/UserPointsContext";
import { updateUserAvatar } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error("Could not read file."));
            }
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error("Could not get canvas context."));
                }
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};


export default function ProfilePage() {
    const { user, points, refreshUser } = useUserPoints();
    const { toast } = useToast();
    
    const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast({
                    variant: 'destructive',
                    title: 'Image Too Large',
                    description: 'Please upload an image smaller than 10MB.',
                });
                return;
            }
            
            setIsProcessingImage(true);
            try {
                const resizedDataUrl = await resizeImage(file, 256, 256);
                setNewAvatarPreview(resizedDataUrl);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Image Processing Error',
                    description: 'Could not process the image. Please try a different file.',
                });
                console.error("Image processing error:", error);
            } finally {
                setIsProcessingImage(false);
            }
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveAvatar = async () => {
        if (!newAvatarPreview || !user) return;
        setIsSaving(true);
        try {
            await updateUserAvatar(user.id, newAvatarPreview);
            await refreshUser();
            toast({
                title: 'Success!',
                description: 'Your profile picture has been updated.',
            });
            setNewAvatarPreview(null);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error updating picture',
                description: 'Failed to save the new profile picture. The file might still be too large.',
            });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    const currentAvatar = newAvatarPreview || user?.avatar || "https://placehold.co/100x100.png";

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">My Profile</h1>
            
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="bg-primary/10 p-8 flex flex-col items-center text-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                                    <AvatarImage src={currentAvatar} alt={user?.name || "User"} data-ai-hint="person"/>
                                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                </Avatar>
                                 <Button
                                    onClick={handleEditClick}
                                    variant="outline"
                                    size="icon"
                                    className="absolute bottom-4 right-0 rounded-full bg-white shadow-md hover:bg-muted"
                                    disabled={isProcessingImage || isSaving}
                                >
                                    {isProcessingImage ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    ) : (
                                        <Camera className="h-5 w-5 text-primary" />
                                    )}
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
                            <CardTitle className="text-2xl font-headline">{user?.name || 'User Name'}</CardTitle>
                            <CardDescription>Member since {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</CardDescription>
                            
                            {newAvatarPreview && (
                                <div className="mt-4 flex gap-2">
                                    <Button onClick={handleSaveAvatar} disabled={isSaving || isProcessingImage}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Picture
                                    </Button>
                                     <Button variant="ghost" onClick={() => setNewAvatarPreview(null)} disabled={isSaving || isProcessingImage}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
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
                                <p className="font-semibold">{user?.email || 'N/A'}</p>
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
                                <p className="font-semibold">{points.toLocaleString()} Points</p>
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
                                <p className="font-semibold">{user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</p>
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
    );
}
