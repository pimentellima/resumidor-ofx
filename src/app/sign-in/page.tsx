import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import SignInOptions from '../../components/sign-in-options'

export default async function SignInPage({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession()

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
                    <SignInOptions />
                </CardContent>
            </Card>
        </div>
    )
}
