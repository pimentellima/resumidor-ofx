import { eq } from 'drizzle-orm'
import { db } from '../db'
import { chats } from '../db/schema'

export async function saveChat({
    id,
    messages,
    userId,
}: {
    id: string
    messages: any
    userId: string
}) {
    try {
        const chat = await db.query.chats.findFirst({
            where: eq(chats.id, id),
        })

        if (chat) {
            return await db
                .update(chats)
                .set({
                    messages: JSON.stringify(messages),
                    updatedAt: new Date(),
                })
                .where(eq(chats.id, id))
        }

        return await db.insert(chats).values({
            id,
            createdAt: new Date(),
            messages: JSON.stringify(messages),
            userId,
        })
    } catch (error) {
        console.error('Failed to save chat in database')
        throw error
    }
}
