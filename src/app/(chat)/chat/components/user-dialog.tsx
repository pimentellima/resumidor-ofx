'use client'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ReactNode } from 'react'
import SignoutButton from './signout-button'

export default function UserDialog({ children }: { children: ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-40">
                <SignoutButton />
            </PopoverContent>
        </Popover>
    )
}
