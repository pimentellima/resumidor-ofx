import { Button } from '@/components/ui/button'
import { Chat } from '@/lib/db/schema'
import { DotIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ChatHistory({ chat }: { chat?: Chat[] }) {
    const params = useParams()
    console.log(chat)
    if (!chat || chat.length === 0) return null

    return (
        <div className="contents">
            {chat.map((chat, i) => {
                const message = chat.messages
                    .filter((message) => message.role === 'user')?.[0]
                    .parts.find((p) => p.type === 'text')?.text
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
                            <DotIcon
                                data-hidden={params.id !== chat.id}
                                className="text-accent-foreground w-32 data-[hidden=true]:w-0 transition-[width]"
                            />
                            {message}
                        </Link>
                    </Button>
                )
            })}
        </div>
    )
}
