
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Bell, User, Wallet, LogOut, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUserPoints } from '@/context/UserPointsContext';

export function UserNav() {
  const { user, logout } = useUserPoints();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className='flex items-center gap-2'>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='relative'>
                    <Bell className="h-5 w-5" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">2</Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                 <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Notifications</p>
                        <Badge variant="secondary">2 unread</Badge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 focus:bg-accent/80 cursor-pointer">
                   <div className='flex items-start gap-3'>
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                        <div>
                            <p className='font-semibold'>Withdrawal Approved!</p>
                            <p className='text-sm text-muted-foreground'>Your withdrawal of $5 has been processed.</p>
                        </div>
                   </div>
                </DropdownMenuItem>
                 <DropdownMenuItem className="p-2 focus:bg-accent/80 cursor-pointer">
                   <div className='flex items-start gap-3'>
                        <Bell className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                        <div>
                            <p className='font-semibold'>Daily Reward</p>
                            <p className='text-sm text-muted-foreground'>You earned 20 points from daily login.</p>
                        </div>
                   </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem className="p-0">
                    <Button variant="ghost" className="w-full h-auto py-2 text-sm text-center text-primary">View all notifications</Button>
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
