'use server'

import { auth } from '../auth'
import getUserChatHistory from '../chat/get-user-chat-history'

export async function getChatHistory() {
    const session = await auth()
    if (!session?.user.id) {
        throw new Error('Unauthorized')
    }
    return await getUserChatHistory(session.user.id)
}
