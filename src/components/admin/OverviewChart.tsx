"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 200) + 50 },
  { name: "Feb", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Mar", total: Math.floor(Math.random() * 200) + 150 },
  { name: "Apr", total: Math.floor(Math.random() * 200) + 200 },
  { name: "May", total: Math.floor(Math.random() * 200) + 250 },
  { name: "Jun", total: Math.floor(Math.random() * 200) + 300 },
  { name: "Jul", total: Math.floor(Math.random() * 200) + 350 },
  { name: "Aug", total: Math.floor(Math.random() * 200) + 400 },
  { name: "Sep", total: Math.floor(Math.random() * 200) + 380 },
  { name: "Oct", total: Math.floor(Math.random() * 200) + 420 },
  { name: "Nov", total: Math.floor(Math.random() * 200) + 450 },
  { name: "Dec", total: Math.floor(Math.random() * 200) + 500 },
]

export function OverviewChart() {
  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>A summary of new user registrations this year.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pl-2">
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
      </CardContent>
    </Card>
  )
}
