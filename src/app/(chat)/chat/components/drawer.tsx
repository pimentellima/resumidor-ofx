'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useHistory from '@/lib/hooks/use-history'
import useImports from '@/lib/hooks/use-imports'
import {
    ArrowLeftFromLineIcon,
    FileIcon,
    HistoryIcon,
    LogOutIcon,
    PlusIcon,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import ChatHistory from './chat-history'
import { ImportStatementsDialog } from './import-statements-dialog'

export default function Drawer() {
    const [open, setOpen] = useState(false)

    const { data: imports } = useImports()
    const { data: history } = useHistory()

    return (
        <div className="flex h-full">
            <div
                data-open={open}
                className="data-[open=true]:w-60 w-16 h-full px-2 py-4
                transition-all duration-300 ease-in-out flex flex-col items-center gap-1 text-muted-foreground"
            >
                <Button
                    variant={'ghost'}
                    className="w-full overflow-hidden"
                    onClick={() => setOpen(!open)}
                >
                    <ArrowLeftFromLineIcon
                        data-open={open}
                        className="data-[open=true]:rotate-0 rotate-180 transition-transform"
                    />
                    {open && 'Close'}
                </Button>
                <ImportStatementsDialog imports={imports}>
                    <Button
                        variant={'ghost'}
                        className="w-full overflow-hidden"
                    >
                        <FileIcon />
                        {open &&
                            `${
                                imports.length > 0 ? `(${imports.length}) ` : ''
                            }Import statements`}
                    </Button>
                </ImportStatementsDialog>
                <Button
                    asChild
                    variant={'default'}
                    className="w-full overflow-hidden"
                >
                    <Link href={'/chat'}>
                        <PlusIcon />
                        {open && 'New chat'}
                    </Link>
                </Button>
                {!open ? (
                    <Button
                        onClick={() => setOpen(true)}
                        variant="ghost"
                        className="w-full"
                    >
                        <HistoryIcon className="" />
                    </Button>
                ) : (
                    <div className="contents w-full mt-10">
                        <Separator className="opacity-70" />
                        <ChatHistory history={history} />
                    </div>
                )}
                <div className="flex-1 flex items-end w-full">
                    <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        className="w-full overflow-hidden"
                    >
                        <LogOutIcon />
                        {open && 'Sign out'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
