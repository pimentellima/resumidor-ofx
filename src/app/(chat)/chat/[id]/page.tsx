import { getChatById } from '@/lib/chat/get-chat-by-id'
import { UIMessage } from 'ai'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Chat from '../chat'

export default async function ChatPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const chatFromDb = await getChatById(id)

    if (!chatFromDb) {
        redirect('/chat')
    }

    return (
        <Suspense fallback={null}>
            <Chat
                id={chatFromDb.id}
                initialMessages={chatFromDb.messages as UIMessage[]}
            />
        </Suspense>
    )
}
