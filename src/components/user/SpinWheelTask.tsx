
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Timer } from 'lucide-react';
import { useUserPoints } from '@/context/UserPointsContext';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { addPointTransaction, updateUserPoints } from '@/lib/storage';

const segments = [
    { color: '#a0c4ff', label: '10' },
    { color: '#fdffb6', label: '20' },
    { color: '#ffc6ff', label: '5' },
    { color: '#9bf6ff', label: '50' },
    { color: '#ffadad', label: '100' },
    { color: '#caffbf', label: '40' },
    { color: '#ffd6a5', label: '15' },
    { color: '#bdb2ff', label: '30' },
];

const conicGradient = `conic-gradient(from -22.5deg, ${segments.map((s, i) => `${s.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`;

export function SpinWheelTask({ task }: { task: Task }) {
    const { user, updatePoints: contextUpdatePoints } = useUserPoints();
    const { toast } = useToast();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [completions, setCompletions] = useState(0);
    const limitPerDay = task.limitPerDay ?? 1;

    const taskUsageKey = user ? `task_usage_${user.id}_${task.id}` : null;

    useEffect(() => {
        if (limitPerDay === 0) {
            setIsDisabled(true);
            return;
        }

        if (!taskUsageKey) return;

        const usageDataString = localStorage.getItem(taskUsageKey);
        if (usageDataString) {
            try {
                const usageData = JSON.parse(usageDataString);
                const firstCompletionTime = new Date(usageData.firstCompletionTimestamp).getTime();
                const now = new Date().getTime();
                const twentyFourHours = 24 * 60 * 60 * 1000;

                if (now - firstCompletionTime > twentyFourHours) {
                    localStorage.removeItem(taskUsageKey);
                    setIsDisabled(false);
                    setCompletions(0);
                    setTimeLeft(0);
                } else {
                    setCompletions(usageData.count);
                    if (usageData.count >= limitPerDay) {
                        setIsDisabled(true);
                        setTimeLeft(twentyFourHours - (now - firstCompletionTime));
                    } else {
                        setIsDisabled(false);
                    }
                }
            } catch (error) {
                console.error("Error parsing task usage data:", error);
                localStorage.removeItem(taskUsageKey);
            }
        } else {
            setIsDisabled(false);
            setCompletions(0);
        }
    }, [taskUsageKey, limitPerDay]);

     useEffect(() => {
        if (!isDisabled || timeLeft <= 0) {
            if (isDisabled && timeLeft <= 0 && limitPerDay !== 0) {
                 localStorage.removeItem(taskUsageKey);
                 setIsDisabled(false);
                 setCompletions(0);
            }
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1000) return 0;
                return prevTime - 1000;
            });
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, [timeLeft, isDisabled, taskUsageKey, limitPerDay]);


    const handleSpin = () => {
        if (isSpinning || isDisabled || !user || !taskUsageKey) return;
        setIsSpinning(true);
        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const stopAngle = Math.floor(Math.random() * 360);
        const finalRotation = rotation + (randomSpins * 360) + stopAngle;
        
        setRotation(finalRotation);
        
        const targetAngle = (360 - (stopAngle % 360)) % 360;
        const segmentIndex = Math.floor((targetAngle + 22.5) / 45) % 8;
        const prize = segments[segmentIndex];

        setTimeout(async () => {
            try {
                const earnedPoints = parseInt(prize.label, 10);
                await updateUserPoints(user.id, earnedPoints);
                contextUpdatePoints(earnedPoints);
                await addPointTransaction({
                    userId: user.id,
                    task: task.title,
                    points: earnedPoints,
                    date: new Date().toISOString(),
                });
                toast({
                    title: 'Congratulations!',
                    description: `You won ${prize.label} points!`,
                });
                
                let newCount = 1;
                try {
                    const usageDataString = localStorage.getItem(taskUsageKey);
                    if (usageDataString) {
                        const usageData = JSON.parse(usageDataString);
                        newCount = usageData.count + 1;
                        const newUsageData = { ...usageData, count: newCount };
                        localStorage.setItem(taskUsageKey, JSON.stringify(newUsageData));
                    } else {
                        const newUsageData = {
                            count: 1,
                            firstCompletionTimestamp: new Date().toISOString()
                        };
                        localStorage.setItem(taskUsageKey, JSON.stringify(newUsageData));
                    }
                } catch (error) {
                    console.error("Error updating spin wheel usage data:", error);
                }
                
                setCompletions(newCount);

                if (newCount >= limitPerDay) {
                    setIsDisabled(true);
                    const twentyFourHours = 24 * 60 * 60 * 1000;
                    setTimeLeft(twentyFourHours);
                }
            } catch (error) {
                console.error("Failed to process spin result:", error);
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not process your spin. Please try again."
                });
            } finally {
                setIsSpinning(false);
            }
        }, 5000);
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
                "flex flex-col text-center items-center p-4 space-y-3 h-full",
                task.color,
                "text-white"
            )}>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 z-10
                        border-t-4 border-t-transparent
                        border-b-4 border-b-transparent
                        border-l-[8px] border-l-slate-800"
                        style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}>
                    </div>
                    
                    <div
                        className="w-full h-full rounded-full border-4 border-slate-800 shadow-inner relative"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            background: conicGradient,
                            transition: 'transform 5s ease-out',
                        }}
                    >
                        {segments.map((segment, index) => {
                            const angle = (index * 45) + (45/2);
                            const angleRad = angle * (Math.PI / 180);
                            const radius = 40;
                            const x = Math.cos(angleRad) * radius;
                            const y = Math.sin(angleRad) * radius;
                            
                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2 left-1/2 flex items-center justify-center text-slate-800 font-bold text-xs"
                                    style={{
                                        width: 0,
                                        height: 0,
                                        transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`
                                    }}
                                >
                                {segment.label}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-grow">
                    <h3 className="font-headline text-lg">{task.title}</h3>
                    <p className="text-sm text-white/70">{task.description}</p>
                </div>
                
                <div className="w-full pt-1">
                    <Button onClick={handleSpin} disabled={isSpinning || isDisabled} className="w-full bg-white text-primary font-bold hover:bg-white/90">
                        {isDisabled ? (
                            timeLeft > 0 ? (
                                <span className="flex items-center">
                                    <Timer className="mr-2 h-4 w-4" />
                                    {formatTime(timeLeft)}
                                </span>
                            ) : (
                                'Unavailable'
                            )
                        ) : isSpinning ? (
                            'Spinning...'
                        ) : (
                            task.actionText
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
