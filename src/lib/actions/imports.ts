'use server'

import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import getUserImports from '../chat/get-user-imports'
import { db } from '../db'
import { bankImports, statements } from '../db/schema'
import { generateStatementsFromCsv } from '../generate-statements-from-csv'

export const deleteImport = async (importId: string) => {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
    if (typeof importId !== 'string')
        throw new Error('Import ID must be a string.')

    await db.delete(bankImports).where(eq(bankImports.id, importId))
}

export async function getImports() {
    const session = await auth()
    if (!session?.user.id) {
        throw new Error('Unauthorized')
    }
    return await getUserImports(session.user.id)
}

export async function importStatementsFromCsv(csvFiles: string[]) {
    const session = await auth()
    if (!session?.user.id) {
        throw new Error('Unauthorized')
    }
    if (csvFiles.length === 0) {
        throw new Error('No files provided')
    }
    await Promise.all(
        Array.from(csvFiles).map(async (csv) => {
            await db.transaction(async (tx) => {
                const rows = generateStatementsFromCsv(csv)
                const [newBankImport] = await tx
                    .insert(bankImports)
                    .values({ userId: session.user.id })
                    .returning()

                await tx.insert(statements).values(
                    rows.map((row) => ({
                        ...row,
                        bankImportId: newBankImport.id,
                        userId: session.user.id,
                    }))
                )
            })
        })
    )
}
