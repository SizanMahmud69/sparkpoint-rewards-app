
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { LucideProps } from 'lucide-react';
import { Calendar, HeartCrack, VenetianMask, RotateCw, Timer, Gift, Dices, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { useUserPoints } from '@/context/UserPointsContext';
import { addPointTransaction, updateUserPoints, getUserTaskCompletion, recordTaskCompletion } from '@/lib/storage';

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Calendar,
  HeartCrack,
  VenetianMask,
  RotateCw,
  Gift,
  Dices,
};

type TaskCardProps = Task;

export function TaskCard({ id, title, description, points, icon, color, actionText, limitPerDay = 1 }: TaskCardProps) {
  const { toast } = useToast();
  const { user, updatePoints: contextUpdatePoints } = useUserPoints();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);

  const Icon = iconMap[icon] || Gift;

  useEffect(() => {
    if (!user || !id) return;
    if (limitPerDay === 0) {
      setIsDisabled(true);
      return;
    }

    const fetchTaskStatus = async () => {
      const completion = await getUserTaskCompletion(user.id, id);
      if (completion) {
        const firstCompletionTime = new Date(completion.firstCompletionTimestamp).getTime();
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - firstCompletionTime > twentyFourHours) {
          setIsDisabled(false);
          setTimeLeft(0);
          setEarnedPoints(null);
        } else {
          if (completion.count >= limitPerDay) {
            setIsDisabled(true);
            setTimeLeft(twentyFourHours - (now - firstCompletionTime));
            setEarnedPoints(completion.lastEarnedPoints ?? null);
          } else {
            setIsDisabled(false);
            setEarnedPoints(null);
          }
        }
      } else {
        setIsDisabled(false);
        setEarnedPoints(null);
      }
    };
    
    fetchTaskStatus();
  }, [user, id, limitPerDay, isCompleting]);


  useEffect(() => {
    if (!isDisabled || timeLeft <= 0) {
      if (isDisabled && timeLeft <= 0 && limitPerDay !== 0) {
        setEarnedPoints(null);
        setIsDisabled(false);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
          if (prevTime <= 1000) {
              return 0;
          }
          return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isDisabled, limitPerDay]);

  const handleTaskComplete = async () => {
    if (!user || !id || isDisabled || isCompleting) return;
    
    setIsCompleting(true);
    
    try {
        let possiblePoints: number[];
        if (points.includes('/')) {
            possiblePoints = points.split('/').map(p => parseInt(p.trim(), 10));
        } else if (points.toLowerCase().includes('up to')) {
            const max = parseInt(points.replace(/[^0-9]/g, ''), 10);
            possiblePoints = [Math.floor(Math.random() * max) + 1];
        } else {
            possiblePoints = [parseInt(points, 10) || 10];
        }
        const finalEarnedPoints = possiblePoints[Math.floor(Math.random() * possiblePoints.length)] || possiblePoints[0];

        await updateUserPoints(user.id, finalEarnedPoints);
        contextUpdatePoints(finalEarnedPoints);
        
        await addPointTransaction({
            userId: user.id,
            task: title,
            points: finalEarnedPoints,
            date: new Date().toISOString(),
        });

        await recordTaskCompletion(user.id, id, finalEarnedPoints);

        toast({
        title: 'Task Complete!',
        description: `You earned ${finalEarnedPoints} points from ${title}.`,
        });
        
    } catch (error) {
        console.error("Failed to complete task:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not complete the task. Please try again."
        });
    } finally {
        setIsCompleting(false);
    }
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
            {earnedPoints !== null && isDisabled ? (
                <div className="flex-grow flex flex-col justify-center items-center">
                    <p className="text-white/80 text-lg">You earned</p>
                    <p className="font-headline text-6xl font-bold">{earnedPoints}</p>
                    <p className="text-white/80 text-lg">Points!</p>
                </div>
            ) : (
                <>
                    <Icon className="h-12 w-12 text-white/80" />
                    <div className="flex-grow">
                        <h3 className="font-headline text-lg">{title}</h3>
                        <p className="text-sm text-white/70">{description}</p>
                    </div>
                </>
            )}
             <div className="w-full pt-2">
              {isDisabled || isCompleting ? (
                  <Button disabled className="w-full bg-white/20 text-white/70 backdrop-blur-sm">
                      {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isCompleting ? 'Processing...' : (
                        timeLeft > 0 ? (
                            <>
                                <Timer className="mr-2 h-4 w-4" />
                                {formatTime(timeLeft)}
                            </>
                        ) : (
                            'Unavailable'
                        )
                      )}
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
