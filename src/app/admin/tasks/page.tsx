"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminTasksPage() {
  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline">Task Management</h1>
            <p className="text-muted-foreground">Task configuration has been moved to the central settings page.</p>
        </div>
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Go to Settings</CardTitle>
                <CardDescription>
                    All task-related settings, including adding, editing, and enabling/disabling tasks, can now be found in the Admin Settings area.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Go to Settings
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
