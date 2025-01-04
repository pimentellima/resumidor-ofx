import { db } from '@/lib/db/index'
import { bankImports, statements } from '@/lib/db/schema'
import { generateStatementsFromCsv } from '@/lib/generate-statements-from-csv'

export async function POST(request: Request) {
    try {
        const { csvFiles } = (await request.json()) as { csvFiles: string[] }

        csvFiles.map(async (file) => {
            await db.transaction(async (tx) => {
                const rows = generateStatementsFromCsv(file)
                await db.insert(statements).values(rows)
            })
        })
        const bankImport = await db.insert(bankImports).values({})
        const rows = generateStatementsFromCsv(csv)
        return new Response('Success', { status: 200 })
    } catch (e) {
        console.log(e)
        const message =
            e instanceof Error && e.message.length
                ? e.message
                : 'Error, please try again.'
        return new Response(message, { status: 500 })
    }
}
