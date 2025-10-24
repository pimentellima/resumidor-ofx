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

export async function importStatementsFromCsv(error = '', formData: FormData) {
    const files = formData.getAll('files') as File[]
    const session = await auth()
    if (!session?.user.id) {
        return 'Unauthorized'
    }
    if (!files || files.length === 0) {
        return 'No files provided'
    }
    try {
        await Promise.all(
            Array.from(files).map(async (file) => {
                const buffer = await file.arrayBuffer()
                console.log(1)
                const csv = new TextDecoder('utf-8').decode(buffer)
                console.log(csv)
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
        return ''
    } catch (e) {
        return 'Some file failed to import'
    }
}
