
"use client"

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getAllPointHistory } from "@/lib/storage";
import { Skeleton } from "../ui/skeleton";

export function PointsEarnedChart() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allHistory = await getAllPointHistory();
      const monthlyData: { [key: string]: number } = {
          "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
          "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
      };

      allHistory.forEach(transaction => {
        if (transaction.points > 0) {
          try {
            const date = new Date(transaction.date);
             if (!isNaN(date.getTime())) {
              const monthIndex = date.getMonth();
              const monthName = Object.keys(monthlyData)[monthIndex];
              if (monthName) {
                  monthlyData[monthName] += transaction.points;
              }
            }
          } catch(e) {
            console.error("Invalid date format for transaction:", transaction);
          }
        }
      });

      const chartData = Object.entries(monthlyData).map(([month, points]) => ({
          month,
          points,
      }));
      
      setData(chartData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle>Total Points Earned</CardTitle>
        <CardDescription>A summary of total points earned by all users this year.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pl-2">
        {loading ? (
            <div className="flex items-center justify-center h-[350px]">
                <Skeleton className="h-full w-full" />
            </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
