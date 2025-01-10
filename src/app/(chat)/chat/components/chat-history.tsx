import { Button } from '@/components/ui/button'
import { Chat } from '@/lib/db/schema'
import { DotIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ChatHistory({ history }: { history: Chat[] }) {
    const params = useParams()

    if (history.length === 0) return null

    return (
        <div className="contents">
            {history.map((chat, i) => {
                const firstAssistantMessage = chat.messages.find(
                    (m) => m.role === 'assistant'
                )
                const content =
                    typeof firstAssistantMessage?.content === 'string'
                        ? firstAssistantMessage.content
                        : (firstAssistantMessage?.content as any)[0].text
                return (
                    <Button
                        asChild
                        key={i}
                        data-is-active={params.id === chat.id}
                        variant="ghost"
                        className="w-full justify-start overflow-hidden 
                        bg-gradient-to-r bg-clip-text text-transparent from-muted-foreground 
                        via-transparent from-[85%] via-[98%] to-transparent
                        hover:text-transparent hover:bg-inherit hover:from-foreground 
                        hover:via-transparent hover:to-transparent"
                    >
                        <Link href={'/chat/' + chat.id}>
                            {params.id === chat.id && (
                                <DotIcon className="text-accent-foreground" />
                            )}
                            {content}
                        </Link>
                    </Button>
                )
            })}
        </div>
    )
}
