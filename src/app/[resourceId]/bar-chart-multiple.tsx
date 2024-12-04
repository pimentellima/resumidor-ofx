'use client'
import { Card, CardContent } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { type BarChartMultiple } from '@/lib/ai/tools'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export default function BarChartMultiple({ data }: BarChartMultiple) {
    const variableNames = data[0].yVariables.map((v) => v.variableName)
    const chartData = data.map(({ xVariable, yVariables }) => {
        const chartItem: Record<string, string | number> = {}
        chartItem['xVariable'] = xVariable
        yVariables.map(
            ({ value, variableName }) => (chartItem[variableName] = value)
        )
        return chartItem
    })

    return (
        <Card className="w-full">
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="xVariable"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {variableNames.map((name, index) => (
                            <Bar
                                fill={`var(--color-${index + 1})`}
                                key={index}
                                dataKey={name}
                                radius={4}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/*  <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{' '}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter> */}
        </Card>
    )
}

const chartConfig = {
    1: {
        label: 'Variable One',
        color: 'hsl(var(--chart-1))',
    },
    2: {
        label: 'Variable One',
        color: 'hsl(var(--chart-2))',
    },
    3: {
        label: 'Variable One',
        color: 'hsl(var(--chart-3))',
    },
    4: {
        label: 'Variable One',
        color: 'hsl(var(--chart-4))',
    },
    5: {
        label: 'Variable One',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig
