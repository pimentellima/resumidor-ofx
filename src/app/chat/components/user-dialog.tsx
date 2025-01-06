'use client'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { UserIcon } from 'lucide-react'
import SignoutButton from './signout-button'

export default function UserDialog() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="lg">
                    <UserIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <SignoutButton />
            </PopoverContent>
        </Popover>
    )
}
