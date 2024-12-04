import { tool } from 'ai'
import { z } from 'zod'
import { findRelevantContent } from './embedding'

const categoryChartSchema = z.object({
    categories: z.array(
        z.object({
            category: z.string(),
            total: z.number().describe('The total amount of the category'),
            items: z.array(
                z.object({
                    description: z
                        .string()
                        .describe(
                            'The description provided by the bank statement'
                        ),
                    amount: z.number(),
                })
            ),
        })
    ),
})

export const barChartMultipleSchema = z.object({
    data: z
        .array(
            z.object({
                xVariable: z.string(),
                yVariables: z.array(
                    z.object({
                        variableName: z.string(),
                        value: z.number(),
                    })
                ),
            })
        )
        .max(5),
})

export type CategoryChart = z.infer<typeof categoryChartSchema>
export type BarChartMultiple = z.infer<typeof barChartMultipleSchema>

const getInformationTool = tool({
    description:
        'Get information from the user bank statements to answer questions',
    parameters: z.object({
        question: z
            .string()
            .describe('the users question related to the financial statements'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
})

const createBarChartMultipleTool = tool({
    description: 'Generate data for a bar chart with multiple variables',
    parameters: barChartMultipleSchema,
    execute: async ({ data: days }) => days,
})

export const tools = {
    getInformation: getInformationTool,
    createBarChartMultiple: createBarChartMultipleTool,
}
