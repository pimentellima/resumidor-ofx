import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Drawer from './chat/components/drawer'

export default async function ChatLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth()

    if (!session?.user.id) {
        return redirect('/sign-in')
    }

    return (
        <div className="h-screen bg-background items-center flex">
            <Drawer />
            <div className="py-3 pr-3 h-full w-full">
                <div className="w-full py-4 h-full border rounded-md bg-black">
                    {children}
                </div>
            </div>
        </div>
    )
}
