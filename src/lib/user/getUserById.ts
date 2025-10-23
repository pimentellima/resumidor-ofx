import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const getUserById = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })
    if (!user) throw new Error('User not found in db')
    return user
}
