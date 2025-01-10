import Chat from './chat'

export default async function ChatPage() {
    const id = crypto.randomUUID()
    return <Chat key={id} id={id} />
}
