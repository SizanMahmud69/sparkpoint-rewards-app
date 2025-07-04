
"use client"

import * as React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getUsers } from '@/lib/storage';
import { Skeleton } from '../ui/skeleton';

export function OverviewChart() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allUsers = await getUsers();
      const monthlyData: { [key: string]: number } = {
          "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
          "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
      };
      
      allUsers.forEach(user => {
        try {
          const date = new Date(user.registrationDate);
          if (!isNaN(date.getTime())) {
            const monthIndex = date.getMonth();
            const monthName = Object.keys(monthlyData)[monthIndex];
            if (monthName) {
                monthlyData[monthName]++;
            }
          }
        } catch(e) {
          console.error("Invalid date format for user:", user);
        }
      });

      const chartData = Object.entries(monthlyData).map(([name, total]) => ({
          name,
          total,
      }));
      
      setData(chartData);
      setLoading(false);
    }
    fetchData();
  }, []);


  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>A summary of new user registrations this year.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pl-2">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
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
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                  contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--foreground))'
                  }}
                  cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
