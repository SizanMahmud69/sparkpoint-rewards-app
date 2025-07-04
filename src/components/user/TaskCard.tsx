
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { LucideProps } from 'lucide-react';
import { Calendar, HeartCrack, VenetianMask, RotateCw, Timer, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { useUserPoints } from '@/context/UserPointsContext';

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Calendar,
  HeartCrack,
  VenetianMask,
  RotateCw,
  Gift,
};

type TaskCardProps = Task;

export function TaskCard({ id, title, description, points, icon, color, actionText }: TaskCardProps) {
  const { toast } = useToast();
  const { updatePoints } = useUserPoints();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const taskKey = `task_cooldown_${id}`;

  const Icon = iconMap[icon] || Gift;

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
      if (isDisabled) localStorage.removeItem(taskKey);
      setIsDisabled(false);
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1000);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, isDisabled, taskKey]);

  const handleTaskComplete = () => {
    let possiblePoints: number[];
    if (points.includes('/')) {
        possiblePoints = points.split('/').map(p => parseInt(p.trim(), 10));
    } else if (points.toLowerCase().includes('up to')) {
        const max = parseInt(points.replace(/[^0-9]/g, ''), 10);
        possiblePoints = [Math.floor(Math.random() * max) + 1];
    } else {
        possiblePoints = [parseInt(points, 10) || 10];
    }
    const earnedPoints = possiblePoints[Math.floor(Math.random() * possiblePoints.length)] || possiblePoints[0];

    updatePoints(earnedPoints);
    toast({
      title: 'Task Complete!',
      description: `You earned ${earnedPoints} points from ${title}.`,
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
    <Card className={cn(
        "p-0 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
    )}>
        <div className={cn(
            "flex flex-col text-center items-center p-6 space-y-4 h-full",
            color,
            "text-white"
        )}>
            <Icon className="h-12 w-12 text-white/80" />
            <div className="flex-grow">
                <h3 className="font-headline text-lg">{title}</h3>
                <p className="text-sm text-white/70">{description}</p>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-bold">
              {points} Points
            </div>
             <div className="w-full pt-2">
              {isDisabled ? (
                  <Button disabled className="w-full bg-white/20 text-white/70 backdrop-blur-sm">
                      <Timer className="mr-2 h-4 w-4" />
                      {formatTime(timeLeft)}
                  </Button>
                  ) : (
                  <Button onClick={handleTaskComplete} className="w-full bg-white text-primary font-bold hover:bg-white/90">
                      {actionText}
                  </Button>
              )}
             </div>
        </div>
    </Card>
  );
}
