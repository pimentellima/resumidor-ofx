import { db } from '@/lib/db/index'
import { tool } from 'ai'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { createResource } from '../actions/resources'
import { findRelevantContent } from './embedding'

export const barChartMultipleSchema = z.object({
    meta: z.object({
        yVariables: z
            .array(
                z.object({
                    index: z.number().describe('The index for the y-variable'),
                    label: z.string().describe('The label for the y-variable'),
                    color: z
                        .string()
                        .describe('The color for the y-variable in hex.'),
                })
            )
            .describe('The color should match the label.')
            .min(1)
            .max(3),
        description: z.string().describe('A description of the chart'),
    }),
    data: z.array(
        z.object({
            x: z
                .string()
                .describe(
                    'The label for the x-axis value. Examples: January 2024, Week 1... '
                ),
            y: z.array(z.object({ index: z.number(), value: z.number() })),
        })
    ),
})

export const pieChartSchema = z.object({
    meta: z.object({
        description: z.string().describe('A description of the chart'),
    }),
    data: z.array(
        z.object({
            variable: z.object({
                label: z.string().describe('The label for the variable'),
                color: z
                    .string()
                    .describe('The color for the variable in hex.'),
                key: z.string().describe('The key of the variable'),
            }),
            value: z.number(),
        })
    ),
})

export type BarChartSchema = z.infer<typeof barChartMultipleSchema>
export type PieChartSchema = z.infer<typeof pieChartSchema>

const getInformationTool = tool({
    description: `Get information from your knowledge base to answer questions.`,
    parameters: z.object({
        question: z.string().describe('the users question'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
})

const addResourceTool = tool({
    description: `add a resource to your knowledge base.
      If the user provides some piece of knowledge about him, use this tool without asking for confirmation.`,
    parameters: z.object({
        content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
    }),
    execute: async ({ content }) => createResource(content),
})

const generateQueryTool = tool({
    description:
        "Generate a postgreSQL compatible query to get information from the database based on the user's question",
    parameters: z.object({
        query: z.string(),
    }),
    execute: async ({ query }) => {
        return { query }
    },
})

const queryDatabaseTool = tool({
    description: 'Query the database with a given query',
    parameters: z.object({
        query: z.string(),
    }),
    execute: async ({ query }) => {
        try {
            const result = await db.execute(sql.raw(query))
            return { result }
        } catch (error) {
            console.log(error)
            return { error }
        }
    },
})

const createBarChartMultipleTool = tool({
    description:
        'Generate data for a bar chart with one, two of three variables based on results from the database',
    parameters: barChartMultipleSchema,
    execute: async (result) => result,
})

const createPieChartTool = tool({
    description:
        'Generate data for a pie chart based on results from the database',
    parameters: pieChartSchema,
    execute: async (result) => result,
})

export const tools = {
    createBarChartMultiple: createBarChartMultipleTool,
    createPieChart: createPieChartTool,
    getInformation: getInformationTool,
    addResource: addResourceTool,
    generateQuery: generateQueryTool,
    queryDatabase: queryDatabaseTool,
}
