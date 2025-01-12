import { getChatById } from '@/lib/db/queries/get-chat-by-id'
import { convertToUIMessages } from '@/lib/utils'
import { CoreMessage } from 'ai'
import { redirect } from 'next/navigation'
import Chat from '../chat'

export default async function ChatPage({ params }: { params: any }) {
    const { id } = params
    const chatFromDb = await getChatById({ id })

    if (!chatFromDb) {
        // mostrar toast de erro
        redirect('/chat')
    }

    return (
        <Chat
            hasUserImports={true}
            key={chatFromDb.id}
            id={chatFromDb.id}
            initialMessages={convertToUIMessages(
                chatFromDb.messages as Array<CoreMessage>
            )}
        />
    )
}
