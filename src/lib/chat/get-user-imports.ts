import { eq } from 'drizzle-orm'
import { db } from '../db'
import { bankImports } from '../db/schema'

export default async function getUserImports(userId: string) {
    const initialImports = await db.query.bankImports.findMany({
        where: eq(bankImports.userId, userId),
    })
    return initialImports
}
