"use client";

import Link from 'next/link';
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
import { Bell, User, Wallet, LogOut } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


export function UserNav() {
  return (
    <div className='flex items-center gap-2'>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className='relative'>
                    <Bell className="h-5 w-5" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">2</Badge>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                    You have 2 unread notifications.
                </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className='p-4 rounded-lg bg-accent/50'>
                        <p className='font-semibold'>Withdrawal Approved!</p>
                        <p className='text-sm text-muted-foreground'>Your withdrawal of $5 has been processed.</p>
                    </div>
                    <div className='p-4 rounded-lg bg-primary/10'>
                        <p className='font-semibold'>Daily Reward</p>
                        <p className='text-sm text-muted-foreground'>You earned 20 points from daily login.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="person" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
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
            <DropdownMenuItem asChild>
                 <Link href="/"><LogOut className="mr-2 h-4 w-4" />Log out</Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
