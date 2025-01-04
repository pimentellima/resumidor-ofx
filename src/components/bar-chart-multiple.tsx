'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { type BarChartSchema } from '@/lib/ai/tools'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export default function BarChartMultiple({ data, meta }: BarChartSchema) {
    const chartData = useMemo(
        () =>
            data.map(({ x, y }) => {
                const item: Record<string, string | number> = { x }
                y.forEach(({ index, value }) => {
                    item['y' + index] = value
                })
                return item
            }),
        [data]
    )

    const chartConfig = useMemo(() => {
        const chartConfig: ChartConfig = {}
        meta.yVariables.forEach((y) => {
            chartConfig['y' + y.index] = {
                label: y.label,
                color: y.color,
            }
        })
        return chartConfig
    }, [meta])

    return (
        <Card className="w-full">
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={'x'}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {meta.yVariables.map((y) => (
                            <Bar
                                key={y.index}
                                label={y.label}
                                fill={y.color}
                                dataKey={'y' + y.index}
                                radius={3}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    {meta.description}
                </div>
            </CardFooter>
        </Card>
    )
}
