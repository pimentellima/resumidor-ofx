import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Chat from './chat'

export default async function ResourcePage() {
    const session = await auth()
    if (!session?.user.id) {
        return redirect('/sign-in')
    }

    return (
        <div className="h-screen bg-background flex items-center">
            <Chat />
        </div>
    )
}
