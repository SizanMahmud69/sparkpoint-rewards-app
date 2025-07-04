"use client"

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function PointsEarnedChart() {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const generatedData = [
      { month: "Jan", points: Math.floor(Math.random() * 50000) + 10000 },
      { month: "Feb", points: Math.floor(Math.random() * 50000) + 20000 },
      { month: "Mar", points: Math.floor(Math.random() * 50000) + 40000 },
      { month: "Apr", points: Math.floor(Math.random() * 50000) + 60000 },
      { month: "May", points: Math.floor(Math.random() * 50000) + 80000 },
      { month: "Jun", points: Math.floor(Math.random() * 50000) + 120000 },
      { month: "Jul", points: Math.floor(Math.random() * 50000) + 150000 },
      { month: "Aug", points: Math.floor(Math.random() * 50000) + 180000 },
      { month: "Sep", points: Math.floor(Math.random() * 50000) + 220000 },
      { month: "Oct", points: Math.floor(Math.random() * 50000) + 250000 },
      { month: "Nov", points: Math.floor(Math.random() * 50000) + 300000 },
      { month: "Dec", points: Math.floor(Math.random() * 50000) + 350000 },
    ];
    setData(generatedData);
  }, []);

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle>Total Points Earned</CardTitle>
        <CardDescription>A summary of total points earned by all users this year.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Number(value) / 1000}k`}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--foreground))'
                }}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1.5 }}
                formatter={(value: number) => [value.toLocaleString(), 'Points']}
            />
            <Line 
                type="monotone" 
                dataKey="points" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 8, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
