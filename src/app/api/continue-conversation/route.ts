import { tools } from '@/lib/ai/tools'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(request: Request) {
    const { messages } = await request.json()

    const result = streamText({
        model: openai('gpt-4o-mini'),
        tools,
        system: `You are a helpful assistent that helps user's with their personal financial data.
        Format the responses breaking lines in to a readable way.
        You should check your knowlegde base before answering the questions. 
        When you generate a chart **don't need to specify the items of the chart, just say that you generated the chart**.
        If the information provided is not sufficient for the question, you should respond accordingly.`,
        messages,
        maxSteps: 10,
    })

    return result.toDataStreamResponse()
}

/*    experimental_output: Output.object({
            schema: z.object({
                categories: z.array(
                    z.object({
                        category: z.string(),
                        total: z
                            .number()
                            .describe('The total amount of the category'),
                        items: z.array(
                            z.object({
                                description: z.string(),
                                amount: z.number(),
                            })
                        ),
                    })
                ),
            }),
        }), */
