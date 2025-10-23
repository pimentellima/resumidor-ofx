import { eq } from 'drizzle-orm'
import { db } from '../db'
import { bankImports } from '../db/schema'

export default async function getUserImports(userId: string) {
    const imports = await db.query.bankImports.findMany({
        where: eq(bankImports.userId, userId),
    })
    return imports
}
