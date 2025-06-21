"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface OfflineAnalysisCardProps {
  data: { hour: number; probability: number }[];
}

const chartConfig = {
  probability: {
    label: "Storm Probability",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function OfflineAnalysisCard({ data }: OfflineAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>72-Hour Historical Analysis</CardTitle>
        <CardDescription>Storm probability trend over the last 72 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                        dataKey="hour"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value}h`}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            indicator="dot"
                            formatter={(value) => `${value}%`}
                            labelFormatter={(label) => `Hour: ${label}`}
                        />}
                    />
                    <Bar dataKey="probability" fill="var(--color-probability)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
