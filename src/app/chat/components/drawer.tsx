'use client'

import { Button } from '@/components/ui/button'
import { bankImports } from '@/lib/db/schema'
import { InferSelectModel } from 'drizzle-orm'
import {
    ArrowLeftFromLineIcon,
    ArrowRightFromLineIcon,
    FileIcon,
    LogOutIcon,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { ImportStatementsDialog } from './import-statements-dialog'

export default function Drawer({
    imports,
}: {
    imports: InferSelectModel<typeof bankImports>[]
}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex h-full">
            <div
                data-open={open}
                className="data-[open=true]:w-60 w-16 h-full px-2 py-4
                transition-all duration-500 ease-in-out flex flex-col items-center gap-1 text-muted-foreground"
            >
                <Button
                    variant={'ghost'}
                    className="w-full overflow-hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? (
                        <ArrowLeftFromLineIcon />
                    ) : (
                        <ArrowRightFromLineIcon />
                    )}
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
