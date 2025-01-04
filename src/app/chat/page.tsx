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
            <Drawer />
            <Chat />
        </div>
    )
}

function Drawer() {
    return (
        <div className="bg-card w-72 h-full">
            <div className="w-full"></div>
        </div>
    )
}
