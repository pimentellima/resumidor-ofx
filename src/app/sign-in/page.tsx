import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SignIn from './components/sign-in'

export default async function SignInPage() {
    const session = await auth()

    if (session?.user) {
        redirect('/chat')
    }

    return (
        <div className="flex items-center justify-center h-screen px-3 bg-background md:px-0">
            <Card className="w-full mx-2 md:w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignIn />
                </CardContent>
            </Card>
        </div>
    )
}
