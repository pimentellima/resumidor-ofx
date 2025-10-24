import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProvidersSignIn from './components/providers-sign-in'
import SignInWithEmail from './components/sign-in-with-email'

export default async function SignIn() {
    const session = await auth()

    if (session?.user) {
        redirect('/chat')
    }
    return (
        <div className="h-screen flex justify-center items-center ">
            <div className="px-6  sm:px-0 col-span-1 h-full flex items-center justify-center ">
                <div className="space-y-6 w-96">
                    <h1 className="text-2xl font-bold">
                        Chat with your financial statements.
                    </h1>
                    <ProvidersSignIn />
                    <div className="flex items-center gap-2">
                        <div className="w-full h-0.5 bg-muted" />
                        <span className="text-xs font-bold text-muted-foreground">
                            OR
                        </span>
                        <div className="w-full h-0.5 bg-muted" />
                    </div>
                    <SignInWithEmail />
                </div>
            </div>
        </div>
    )
}
