
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dices, Timer } from 'lucide-react';
import { useUserPoints } from '@/context/UserPointsContext';

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

const taskKey = 'spin_wheel_cooldown';

export function SpinWheelTask() {
    const { toast } = useToast();
    const { updatePoints } = useUserPoints();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [isCooldown, setIsCooldown] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const cooldownEnd = localStorage.getItem(taskKey);
        if (cooldownEnd) {
            const remaining = new Date(cooldownEnd).getTime() - new Date().getTime();
            if (remaining > 0) {
                setIsCooldown(true);
                setTimeLeft(remaining);
            } else {
                localStorage.removeItem(taskKey);
            }
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (isCooldown) localStorage.removeItem(taskKey);
            setIsCooldown(false);
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, isCooldown]);


    const handleSpin = () => {
        if (isSpinning || isCooldown) return;
        setIsSpinning(true);
        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const stopAngle = Math.floor(Math.random() * 360);
        const finalRotation = rotation + (randomSpins * 360) + stopAngle;
        
        setRotation(finalRotation);
        
        const targetAngle = (360 - (stopAngle % 360)) % 360;
        const segmentIndex = Math.floor((targetAngle + 22.5) / 45) % 8;
        const prize = segments[segmentIndex];

        setTimeout(() => {
            const earnedPoints = parseInt(prize.label, 10);
            updatePoints(earnedPoints);
            toast({
                title: 'Congratulations!',
                description: `You won ${prize.label} points!`,
            });
            setIsSpinning(false);
            
            const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours
            const cooldownEnd = new Date(new Date().getTime() + cooldownDuration);
            localStorage.setItem(taskKey, cooldownEnd.toISOString());
            setIsCooldown(true);
            setTimeLeft(cooldownDuration);
        }, 5000); // Must match transition duration
    };

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-center w-full">
            <Card className="p-6 flex flex-col items-center justify-center space-y-6 shadow-lg rounded-2xl w-full max-w-md">
                <div className="flex items-center gap-3 self-start">
                    <Dices className="w-8 h-8 text-yellow-500" />
                    <div>
                        <h3 className="font-bold font-headline text-2xl">Spin the Wheel</h3>
                        <p className="text-sm text-muted-foreground">Try your luck to win big rewards!</p>
                    </div>
                </div>

                <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                    <div className="absolute top-1/2 -right-3 sm:-right-4 -translate-y-1/2 w-0 h-0 z-10
                        border-t-8 border-t-transparent
                        border-b-8 border-b-transparent
                        border-l-[16px] border-l-slate-800"
                        style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}>
                    </div>
                    
                    <div
                        className="w-full h-full rounded-full border-8 border-slate-800 shadow-inner relative"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            background: conicGradient,
                            transition: 'transform 5s ease-out',
                        }}
                    >
                        {segments.map((segment, index) => {
                            const angle = (index * 45) + (45/2);
                            const angleRad = angle * (Math.PI / 180);
                            const radius = 90;
                            const x = Math.cos(angleRad) * radius;
                            const y = Math.sin(angleRad) * radius;
                            
                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2 left-1/2 flex items-center justify-center text-slate-800 font-bold text-xl"
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

                <Button onClick={handleSpin} disabled={isSpinning || isCooldown} size="lg" className="w-full max-w-sm bg-slate-800 hover:bg-slate-700 text-lg font-bold">
                    {isCooldown ? (
                        <>
                            <Timer className="mr-2 h-5 w-5" />
                            {formatTime(timeLeft)}
                        </>
                    ) : isSpinning ? (
                        'Spinning...'
                    ) : (
                        'Spin for a Prize'
                    )}
                </Button>
            </Card>
        </div>
    );
}
