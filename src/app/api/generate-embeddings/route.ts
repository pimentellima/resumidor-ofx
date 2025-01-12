import { auth } from '@/lib/auth'
import { db } from '@/lib/db/index'
import { bankImports, statements } from '@/lib/db/schema'
import { generateStatementsFromCsv } from '@/lib/generate-statements-from-csv'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user.id) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { csvFiles } = (await request.json()) as { csvFiles: string[] }

        csvFiles.map(async (file) => {
            await db.transaction(async (tx) => {
                const rows = generateStatementsFromCsv(file)
                const [newBankImport] = await db
                    .insert(bankImports)
                    .values({ userId: session.user.id })
                    .returning()

                await db.insert(statements).values(
                    rows.map((row) => ({
                        ...row,
                        bankImportId: newBankImport.id,
                        userId: session.user.id,
                    }))
                )
            })
        })

        revalidatePath('/chat')
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
