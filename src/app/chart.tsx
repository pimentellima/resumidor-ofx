'use client'

import { Statement } from '@/lib/types'
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Text,
    XAxis,
    YAxis,
} from 'recharts'

export function Chart({
    statements,
}: {
    statements: (Statement & { category: string })[]
}) {
    const sortByCategory = (
        statements: (Statement & { category: string })[]
    ) => {
        const categories = statements.reduce((acc, statement) => {
            if (!acc[statement.category]) {
                acc[statement.category] = 0
            }
            acc[statement.category] += statement.amount
            return acc
        }, {} as Record<string, number>)

        return Object.entries(categories).map(([name, total]) => ({
            name,
            total,
        }))
    }

    return (
        <div className="mt-7">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sortByCategory(statements)}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        height={50}
                        interval={0}
                        axisLine={false}
                        tick={({ x, y, payload }: any) => {
                            if (payload && payload.value) {
                                return (
                                    <Text
                                        fontSize={'12px'}
                                        width={'12px'}
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        verticalAnchor="start"
                                    >
                                        {payload.value}
                                    </Text>
                                )
                            }
                            return <></>
                        }}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        width={80}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                            `${value.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}`
                        }
                    />
                    <Bar radius={[2, 2, 2, 2]} dataKey="total">
                        {sortByCategory(statements).map(({ total }, index) => (
                            <Cell
                                className={`${
                                    total >= 0
                                        ? 'fill-green-800'
                                        : 'fill-red-800'
                                }`}
                                key={`cell-${index}`}
                                strokeWidth={index === 2 ? 4 : 1}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
