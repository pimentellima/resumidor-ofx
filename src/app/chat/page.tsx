import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bankImports } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Chat from './chat'
import { ImportStatementsDialog } from './components/import-statements-dialog'
import UserDialog from './components/user-dialog'

export default async function ResourcePage() {
    const session = await auth()
    if (!session?.user.id) {
        return redirect('/sign-in')
    }

    const imports = await db.query.bankImports.findMany({
        where: eq(bankImports.userId, session.user.id),
    })

    return (
        <div className="h-screen bg-background items-center">
            <div className="fixed top-2 right-2 flex gap-2">
                <ImportStatementsDialog imports={imports} />
                <UserDialog />
            </div>
            <Chat />
        </div>
    )
}
