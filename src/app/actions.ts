'use server'
import { getBusinessInfoByCnpj } from '@/lib/get-business-info-by-cnpj'
import { getCnpjFromText } from '@/lib/get-cnpj-from-text'
import s3 from '@/lib/s3'
import { Statement } from '@/lib/types'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import * as z from 'zod'

export async function getCategories(statements: Omit<Statement, 'category'>[]) {
    try {
        const statementsWithBusinessInfo = await Promise.all(
            statements.map(async (statement) => {
                const { amount, fit_id, description } = statement
                const cnpj = getCnpjFromText(statement.description)
                if (!cnpj) return { amount, fit_id, description }
                const businessInfo = await getBusinessInfoByCnpj(cnpj)
                if (!businessInfo) return { amount, fit_id, description }
                return {
                    valor: amount,
                    idTransacao: fit_id,
                    descricao: description,
                    infoEmpresa: businessInfo,
                }
            })
        )

        const { object, usage } = await generateObject({
            model: openai('gpt-4o-2024-05-13'),
            system: 'Você é um bot categorizador de transações financeiras. Você irá ler uma lista de transações financeiras e categorizar de acordo com as informações passadas. As categorias devem levar em conta o valor, a descrição e a informação da empresa, caso exista.',
            prompt: JSON.stringify(statementsWithBusinessInfo),
            schema: z.object({
                results: z.array(
                    z.object({
                        itemId: z.string().describe('O id da transação'),
                        category: z
                            .string()
                            .describe(
                                'A categoria da transação em português(BR).'
                            ),
                    })
                ),
            }),
        })

        let results: (Statement & { category: string })[] = []
        for (const result of object.results) {
            const statement = statements.find(
                ({ fit_id }) => fit_id === result.itemId
            )

            if (!statement) return { error: 'Validation failed' }

            results.push({ ...statement, category: result.category })
        }
        return { results }
    } catch (e) {
        return { error: 'Error' }
    }
}

export async function uploadPdfToS3(formData: FormData) {
    const file = formData.get('file')
    if (!(file instanceof File)) return 'Invalid file'
    if (file.type !== 'application/pdf') return 'File must be a pdf'
    const pdfBuffer = Buffer.from(await file.arrayBuffer())
    const key = crypto.randomUUID()
    await s3.putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
    })
    // redirect('' + key)
}
