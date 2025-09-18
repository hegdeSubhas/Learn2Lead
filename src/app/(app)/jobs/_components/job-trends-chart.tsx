"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Web Dev", demand: 4000, color: "hsl(var(--chart-1))" },
  { name: "Mobile Dev", demand: 3000, color: "hsl(var(--chart-2))" },
  { name: "Data Science", demand: 2780, color: "hsl(var(--chart-3))" },
  { name: "AI/ML", demand: 1890, color: "hsl(var(--chart-4))" },
  { name: "CyberSec", demand: 2390, color: "hsl(var(--chart-5))" },
]

export function JobTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">In-Demand Fields</CardTitle>
        <CardDescription>Current demand for popular tech roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))"/>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Bar dataKey="demand" name="Job Openings" fill="var(--color)" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                         <rect key={`bar-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
