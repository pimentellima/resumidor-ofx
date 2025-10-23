import { auth } from '@/lib/auth'
import getUserChatHistory from '@/lib/chat/get-user-chat-history'
import getUserImports from '@/lib/chat/get-user-imports'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import Chat from './chat'

export default async function ChatPage() {
    const id = crypto.randomUUID()

    const session = await auth()
    const queryClient = new QueryClient()
    if (session?.user.id) {
        await queryClient.prefetchQuery({
            queryKey: ['imports'],
            queryFn: async () =>
                await getUserImports(session.user.id as string),
        })
        await queryClient.prefetchQuery({
            queryKey: ['history'],
            queryFn: async () =>
                await getUserChatHistory(session.user.id as string),
        })
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Chat key={id} id={id} />
        </HydrationBoundary>
    )
}
