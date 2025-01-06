'use client'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function SignoutButton() {
    return (
        <Button
            className="w-full"
            variant="destructive"
            onClick={() => signOut()}
        >
            <LogOutIcon />
            Sair
        </Button>
    )
}
