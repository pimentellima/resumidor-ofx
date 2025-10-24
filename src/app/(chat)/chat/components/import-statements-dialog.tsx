'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { deleteImport } from '@/lib/actions/imports'
import { bankImports } from '@/lib/db/schema'
import useImportMutation from '@/lib/hooks/use-import'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { FileIcon, Loader2Icon, TrashIcon } from 'lucide-react'
import { ChangeEvent, ReactNode, useState } from 'react'

export function ImportStatementsDialog({
    imports,
    children,
}: {
    imports?: InferSelectModel<typeof bankImports>[]
    children: ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<FileList | null>(null)

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setFiles(e.target.files)
    }
    const { mutate, isPending } = useImportMutation({
        onSuccess: () => setFiles(null),
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import statements</DialogTitle>
                    <DialogDescription className="text-sm">
                        Select and manage your imported bank statements here.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 max-h-96 overflow-auto">
                    {imports?.map((bankImport) => (
                        <BankImportItem
                            key={bankImport.id}
                            onImportSuccess={() => setFiles(null)}
                            bankImport={bankImport}
                        />
                    ))}
                </div>
                {imports && imports.length > 0 && <Separator />}
                <div className="flex flex-col">
                    <div className="flex gap-1 text-foreground">
                        <Input
                            onChange={handleChangeFile}
                            id={'file-input'}
                            type="file"
                            className="text-muted-foreground file:border-input file:text-foreground 
                                p-0 pr-3 italic file:mr-3 file:h-full file:border-0 
                                file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm 
                                file:font-medium file:not-italic"
                        />
                        <Button
                            disabled={isPending || !files || files.length === 0}
                            onClick={() => mutate(files!)}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-1">
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                    <span>Importing</span>
                                </div>
                            ) : (
                                'Import'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function BankImportItem({
    bankImport,
    onImportSuccess,
}: {
    bankImport: InferSelectModel<typeof bankImports>
    onImportSuccess?: () => void
}) {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey: ['imports'],
        mutationFn: async () => deleteImport(bankImport.id),
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['imports'],
            })
            onImportSuccess && onImportSuccess()
            toast({ title: 'Import deleted successfully' })
        },
        onError: () => {
            toast({
                title: 'Error deleting import',
                variant: 'destructive',
            })
        },
    })
    return (
        <div className="flex gap-1 items-center border rounded-md p-2">
            <FileIcon className="h-5 w-5" />
            <span className="text-sm">
                {'Imported at ' +
                    format(bankImport.createdAt, 'dd/MM/yyyy HH:mm')}
            </span>
            <div className="flex flex-1 gap-1 justify-end">
                <Button
                    disabled={isPending}
                    onClick={() => mutate()}
                    variant={'destructive'}
                >
                    {isPending ? (
                        <Loader2Icon className="animate-spin" />
                    ) : (
                        <TrashIcon />
                    )}
                    Delete
                </Button>
            </div>
        </div>
    )
}
