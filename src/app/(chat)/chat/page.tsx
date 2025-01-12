import { auth } from '@/lib/auth'
import getUserImports from '@/lib/db/queries/get-user-imports'
import Chat from './chat'

export default async function ChatPage() {
    const id = crypto.randomUUID()

    const session = await auth()
    const imports = await getUserImports(session?.user.id as string)

    return <Chat hasUserImports={imports.length !== 0} key={id} id={id} />
}
