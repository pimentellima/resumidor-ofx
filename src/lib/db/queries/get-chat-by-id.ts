import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { chats } from '../schema'

export async function getChatById({ id }: { id: string }) {
    return await db.query.chats.findFirst({
        where: eq(chats.id, id),
    })
}
