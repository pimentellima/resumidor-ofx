import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function generateStatementsObject(pdf: ArrayBuffer) {
    const result = await generateObject({
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'file', data: pdf, mimeType: 'application/pdf' },
                ],
            },
        ],
        model: openai('gpt-4'),
        system: 'You will extract data from the PDF file and generate rows for the statement.',
        schema: z.object({
            rows: z.array(
                z.object({
                    date: z.string().describe('Date should be YYYY-MM-DD'),
                    description: z.string(),
                    amount: z
                        .string()
                        .describe('Amount should be in numeric format'),
                })
            ),
        }),
    })
    console.log(
        result.usage.promptTokens + '--' + result.usage.completionTokens
    )
    return result.object.rows
}
