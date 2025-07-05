
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, User, Wallet, LogOut, CheckCircle, XCircle, Info, LayoutDashboard } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUserPoints } from '@/context/UserPointsContext';
import { getNotificationsForUser, markNotificationsAsRead } from '@/lib/storage';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';


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

export function UserNav() {
  const { user, logout } = useUserPoints();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (user) {
        const userNotifications = await getNotificationsForUser(user.id);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
    }
  }
  
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleOpenChange = async (open: boolean) => {
    if (open && user && unreadCount > 0) {
        setTimeout(async () => {
            await markNotificationsAsRead(user.id);
            await fetchNotifications();
        }, 1500);
    }
  }

  return (
    <div className='flex items-center gap-2'>
        <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='relative'>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{unreadCount}</Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                 <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Notifications</p>
                        {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(notification => (
                         <DropdownMenuItem key={notification.id} className={cn("p-2 focus:bg-accent/80", !notification.read && "bg-primary/10")}>
                           <div className='flex items-start gap-3'>
                                <NotificationIcon type={notification.type} />
                                <div>
                                    <p className='font-semibold'>{notification.title}</p>
                                    <p className='text-sm text-muted-foreground whitespace-normal'>{notification.description}</p>
                                </div>
                           </div>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="text-center text-sm text-muted-foreground p-4">
                        You have no notifications.
                    </div>
                )}
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex justify-center text-sm text-primary cursor-pointer hover:underline">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "https://placehold.co/100x100.png"} alt={user?.name || "User"} data-ai-hint="person" />
                <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Guest'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {user?.email || ''}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/wallet"><Wallet className="mr-2 h-4 w-4" />Wallet</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
