'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function ProvidersSignIn() {
    return (
        <div className="flex flex-col gap-4">
            <Button
                onClick={async () => await signIn('google')}
                variant="secondary"
                className="w-full"
            >
                Continue with Google
            </Button>
            <Button
                onClick={async () => await signIn('github')}
                variant="secondary"
                className="w-full"
            >
                Continue with Github
            </Button>
        </div>
    )
}
