import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div className="h-screen flex flex-col justify-center items-center">
            <Card className="bg-primary/10">
                <CardHeader>
                    <CardTitle>Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 w-96">
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
                </CardContent>
            </Card>
        </div>
    )
}
