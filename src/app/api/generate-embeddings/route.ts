import { db } from '@/lib/db/index'
import { statements } from '@/lib/db/schema'
import { generateStatementsFromCsv } from '@/lib/generate-statements-from-csv'

export async function POST(request: Request) {
    try {
        const { csv } = await request.json()
        const rows = generateStatementsFromCsv(csv)
        await db.insert(statements).values(rows)
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
