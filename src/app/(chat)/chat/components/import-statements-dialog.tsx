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
import { FileIcon, Loader2Icon, LoaderIcon, TrashIcon } from 'lucide-react'
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

    console.log(files)

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
                    <div className="flex gap-1">
                        <Input
                            id="files"
                            name="files"
                            type="file"
                            disabled={isPending}
                            accept=".csv"
                            multiple={true}
                            onChange={handleChangeFile}
                        />
                        {files && (
                            <Button
                                disabled={isPending}
                                onClick={() => mutate(files)}
                                variant={'outline'}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-1">
                                        <LoaderIcon className="w-4 h-4 animate-spin" />
                                        <span>Importando</span>
                                    </div>
                                ) : (
                                    'Importar'
                                )}
                            </Button>
                        )}
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
                {'Importado em ' +
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
