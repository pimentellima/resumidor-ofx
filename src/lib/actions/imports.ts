'use server'

import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import { db } from '../db'
import { bankImports } from '../db/schema'

export const deleteImport = async (importId: string) => {
    try {
        const session = await auth()
        if (!session?.user) throw new Error('Unauthorized')
        if (typeof importId !== 'string')
            throw new Error('Import ID must be a string.')

        await db.delete(bankImports).where(eq(bankImports.id, importId))
    } catch (e) {
        if (e instanceof Error)
            return e.message.length > 0 ? e.message : 'Error, please try again.'
    }
}
