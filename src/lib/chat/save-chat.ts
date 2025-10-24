import { db } from '../db'
import { chats } from '../db/schema'

export async function saveChat({
    chatId,
    messages,
    userId,
}: {
    chatId: string
    messages: any
    userId: string
}) {
    try {
        return await db
            .insert(chats)
            .values({
                id: chatId,
                createdAt: new Date(),
                messages: JSON.stringify(messages),
                userId: userId,
            })
            .onConflictDoUpdate({
                target: [chats.id],
                set: {
                    messages: JSON.stringify(messages),
                    updatedAt: new Date(),
                    userId: userId,
                },
            })
    } catch (error) {
        console.error('Failed to save chat in database')
        throw error
    }
}
