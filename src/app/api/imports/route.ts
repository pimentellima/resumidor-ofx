import { auth } from '@/lib/auth'
import getUserImports from '@/lib/db/queries/get-user-imports'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session?.user.id) {
            return new Response('Unauthorized', { status: 401 })
        }
        const imports = await getUserImports(session.user.id)

        return NextResponse.json(imports)
    } catch (e) {
        console.log(e)
        const message =
            e instanceof Error && e.message.length
                ? e.message
                : 'Error, please try again.'
        return new Response(message, { status: 500 })
    }
}
