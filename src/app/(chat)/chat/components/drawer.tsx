'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BankImport, Chat } from '@/lib/db/schema'
import {
    ArrowLeftFromLineIcon,
    FileIcon,
    HistoryIcon,
    LogOutIcon,
    PlusIcon,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import ChatHistory from './chat-history'
import { ImportStatementsDialog } from './import-statements-dialog'

async function fetchUserHistory() {
    const response = await fetch('/api/history')
    if (!response.ok) throw new Error('Failed to fetch user history')
    return await response.json()
}

async function fetchUserImports() {
    const response = await fetch('/api/imports')
    if (!response.ok) throw new Error('Failed to fetch user imports')
    return await response.json()
}

export default function Drawer({
    initialImports,
    initialHistory,
}: {
    initialImports: BankImport[]
    initialHistory: Chat[]
}) {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)

    const { data: imports } = useQuery({
        queryKey: ['imports', session?.user.id],
        queryFn: fetchUserImports,
        enabled: !!session?.user.id,
        initialData: initialImports,
    })

    const { data: history } = useQuery({
        queryKey: ['history', session?.user.id],
        queryFn: fetchUserHistory,
        enabled: !!session?.user.id,
        initialData: initialHistory,
        refetchOnWindowFocus: true,
    })

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
                    {open && 'Fechar'}
                </Button>
                <ImportStatementsDialog imports={imports}>
                    <Button
                        variant={'ghost'}
                        className="w-full overflow-hidden"
                    >
                        <FileIcon />
                        {open && 'Importar extratos'}
                    </Button>
                </ImportStatementsDialog>
                <Button
                    asChild
                    variant={'default'}
                    className="w-full overflow-hidden"
                >
                    <Link href={'/chat'}>
                        <PlusIcon />
                        {open && 'Novo chat'}
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
                        variant="destructive"
                        className="w-full overflow-hidden"
                    >
                        <LogOutIcon />
                        {open && 'Sair'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
