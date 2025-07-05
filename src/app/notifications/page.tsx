"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useUserPoints } from '@/context/UserPointsContext';
import { getNotificationsForUser } from '@/lib/storage';
import type { Notification } from '@/lib/types';
import { Bell, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>;
        case 'error':
            return <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0"/>;
        case 'info':
        default:
            return <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>;
    }
}

export default function NotificationsPage() {
    const { user } = useUserPoints();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                setLoading(true);
                const userNotifications = await getNotificationsForUser(user.id);
                setNotifications(userNotifications);
                setLoading(false);
            }
        };
        if (user) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Notifications</h1>
                <p className="text-muted-foreground">A complete history of your account notifications.</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-4 p-4">
                                    <Skeleton className="h-6 w-6 rounded-full mt-1" />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton className="h-5 w-1/3" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className={cn("flex items-start gap-4 p-4", !notification.read && "bg-primary/5")}>
                                    <NotificationIcon type={notification.type} />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{notification.title}</p>
                                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
                                <Bell className="h-12 w-12 mb-4" />
                                <p className="text-lg font-semibold">No notifications yet</p>
                                <p>Come back later to see updates about your account.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
