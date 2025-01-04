'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { Input } from './ui/input'

export default function SignInOptions() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const error = searchParams.get('error')
    const callbackUrl = process.env.NEXT_PUBLIC_URL! + '/chat'

    const handleSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await signIn('email', {
            email,
            callbackUrl,
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <Button
                size={'lg'}
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full"
            >
                Continue with Google
            </Button>
            <Button
                size={'lg'}
                onClick={() => signIn('github', { callbackUrl })}
                className="w-full"
            >
                Continue with Github
            </Button>
            <div className="h-1 my-2 w-full bg-accent border" />
            <form onSubmit={handleSubmitEmail} className="contents">
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    autoComplete="email"
                    className="bg-white"
                    placeholder="pottsfield.pumpkin@unknownwoods.com"
                />
                <Button
                    type="submit"
                    size={'lg'}
                    className="w-full"
                    variant={'outline'}
                >
                    Continue with Email
                    <ArrowRight className="w-5 ml-1" />
                </Button>
            </form>
            {error && (
                <p className="mt-1 text-sm text-destructive">
                    An error occurred signing in
                </p>
            )}
        </div>
    )
}
