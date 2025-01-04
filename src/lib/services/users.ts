import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

export const getUserById = cache(async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })
    if (!user) throw new Error('User not found in db')
    return user
})
