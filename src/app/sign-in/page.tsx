import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProvidersSignIn from './components/providers-sign-in'

export default async function SignIn() {
    const session = await auth()

    if (session?.user) {
        redirect('/chat')
    }
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Card className="bg-primary/10">
                <CardHeader>
                    <CardTitle>Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent className="sm:w-96">
                    <ProvidersSignIn />
                </CardContent>
            </Card>
        </div>
    )
}
