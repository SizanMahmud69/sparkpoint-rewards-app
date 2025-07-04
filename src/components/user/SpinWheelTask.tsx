
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Timer } from 'lucide-react';
import { useUserPoints } from '@/context/UserPointsContext';
import { cn } from '@/lib/utils';
import type { Task, UserTaskCompletion } from '@/lib/types';
import { addPointTransaction, updateUserPoints, getUserTaskCompletion, recordTaskCompletion } from '@/lib/storage';

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
    const limitPerDay = task.limitPerDay ?? 1;

    useEffect(() => {
        if (!user || !task.id) return;
        if (limitPerDay === 0 || user.status === 'Frozen') {
            setIsDisabled(true);
            return;
        }

        const fetchTaskStatus = async () => {
            const completion = await getUserTaskCompletion(user.id, task.id);
            if (completion) {
                const firstCompletionTime = new Date(completion.firstCompletionTimestamp).getTime();
                const now = new Date().getTime();
                const twentyFourHours = 24 * 60 * 60 * 1000;

                if (now - firstCompletionTime > twentyFourHours) {
                    setIsDisabled(false);
                    setTimeLeft(0);
                } else {
                    if (completion.count >= limitPerDay) {
                        setIsDisabled(true);
                        setTimeLeft(twentyFourHours - (now - firstCompletionTime));
                    } else {
                        setIsDisabled(false);
                    }
                }
            } else {
                setIsDisabled(false);
            }
        };

        fetchTaskStatus();
    }, [user, task.id, limitPerDay, isSpinning]);


     useEffect(() => {
        if (!isDisabled || timeLeft <= 0) {
            if (isDisabled && timeLeft <= 0 && limitPerDay !== 0 && user?.status !== 'Frozen') {
                 setIsDisabled(false);
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
    }, [timeLeft, isDisabled, limitPerDay, user]);


    const handleSpin = () => {
        if (isSpinning || isDisabled || !user ) return;

        if (user.status === 'Frozen') {
            toast({
                variant: "destructive",
                title: "Account Frozen",
                description: "You cannot complete tasks while your account is frozen.",
            });
            return;
        }
        
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
                
                await recordTaskCompletion(user.id, task.id, earnedPoints);

                toast({
                    title: 'Congratulations!',
                    description: `You won ${prize.label} points!`,
                });
                
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
                    <Button onClick={handleSpin} disabled={isSpinning || isDisabled || user?.status === 'Frozen'} className="w-full bg-white text-primary font-bold hover:bg-white/90">
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
