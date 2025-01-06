import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bankImports } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Chat from './chat'
import Drawer from './components/drawer'

export default async function ChatPage() {
    const session = await auth()
    if (!session?.user.id) {
        return redirect('/sign-in')
    }

    const imports = await db.query.bankImports.findMany({
        where: eq(bankImports.userId, session.user.id),
    })

    return (
        <div className="h-screen bg-background items-center flex">
            <Drawer imports={imports} />
            <div className="py-3 pr-3 h-full w-full">
                <Chat />
            </div>
        </div>
    )
}
