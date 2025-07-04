"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

interface TaskCardProps {
  title: string;
  description: string;
  points: string;
  icon: LucideIcon;
  color: string;
  actionText: string;
}

export function TaskCard({ title, description, points, icon: Icon, color, actionText }: TaskCardProps) {
  const { toast } = useToast();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const taskKey = `task_cooldown_${title.replace(/\s+/g, '_')}`;

  useEffect(() => {
    const cooldownEnd = localStorage.getItem(taskKey);
    if (cooldownEnd) {
      const remaining = new Date(cooldownEnd).getTime() - new Date().getTime();
      if (remaining > 0) {
        setIsDisabled(true);
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem(taskKey);
      }
    }
  }, [taskKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisabled(false);
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1000);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleTaskComplete = () => {
    const randomPointsMap: { [key: string]: number[] } = {
        'Scratch & Win': [10, 20, 30],
        'Crack Your Heart': [5, 10, 15],
        'Spin & Wheel': [5, 8, 10, 15, 20],
        'Daily Login Reward': [20]
    };

    const possiblePoints = randomPointsMap[title] || [10];
    const earnedPoints = possiblePoints[Math.floor(Math.random() * possiblePoints.length)];

    toast({
      title: 'Task Complete!',
      description: `You earned ${earnedPoints} points from ${title}.`,
      className: 'bg-accent text-accent-foreground',
    });

    const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours
    const cooldownEnd = new Date(new Date().getTime() + cooldownDuration);
    localStorage.setItem(taskKey, cooldownEnd.toISOString());
    setIsDisabled(true);
    setTimeLeft(cooldownDuration);
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-full', color)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="font-headline text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary font-headline">{points} <span className="text-sm font-normal text-muted-foreground">Points</span></p>
      </CardContent>
      <CardFooter>
        {isDisabled ? (
          <Button disabled className="w-full">
            <Timer className="mr-2 h-4 w-4" />
            Come back in {formatTime(timeLeft)}
          </Button>
        ) : (
          <Button onClick={handleTaskComplete} className="w-full bg-primary hover:bg-primary/90">
            {actionText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
