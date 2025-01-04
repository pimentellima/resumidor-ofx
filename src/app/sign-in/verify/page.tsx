import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function VerifyPage({
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
                    <CardTitle className="text-xl">Check your email</CardTitle>
                    <CardDescription>
                        A sign in link has been sent to your email address.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
