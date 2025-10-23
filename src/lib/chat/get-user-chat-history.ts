import { desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { Chat, chats } from '../db/schema'

export default async function getUserChatHistory(userId: string) {
    const history = (await db.query.chats.findMany({
        where: eq(chats.userId, userId),
        limit: 5,
        orderBy: [desc(chats.updatedAt)],
    })) as Chat[]
    return history
}
