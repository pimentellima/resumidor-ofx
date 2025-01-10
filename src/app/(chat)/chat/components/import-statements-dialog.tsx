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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { bankImports } from '@/lib/db/schema'
import { format } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import { FileIcon, LoaderIcon, ScanEyeIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, ReactNode, useState } from 'react'

export function ImportStatementsDialog({
    imports,
    children,
}: {
    imports: InferSelectModel<typeof bankImports>[]
    children: ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<FileList | null>(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setFiles(e.target.files)
    }

    const handleImportFiles = async () => {
        if (!files) return
        setLoading(true)

        try {
            const csvFiles = await Promise.all(
                Array.from(files).map(async (file) => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            const decoder = new TextDecoder()
                            const csv = decoder.decode(
                                reader.result as ArrayBuffer
                            )
                            resolve(csv)
                        }

                        reader.onerror = (error) => reject(error)
                        reader.readAsArrayBuffer(file)
                    })
                })
            )

            const response = await fetch('/api/generate-embeddings', {
                method: 'POST',
                body: JSON.stringify({ csvFiles }),
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }

            setOpen(false)
        } catch (error) {
            toast({
                title: 'Error',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar extratos</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 max-h-32 overflow-auto">
                    {imports.map((bankImport) => (
                        <BankImportItem
                            key={bankImport.id}
                            bankImport={bankImport}
                        />
                    ))}
                </div>
                <Separator />
                <div className="flex flex-col mb-2">
                    <Label
                        htmlFor="file"
                        className="mt-2 font-semibold mb-2 pl-4"
                    >
                        Selecione um ou mais arquivos .csv para importar
                    </Label>
                    <div className="flex gap-1">
                        <Input
                            id="file"
                            type="file"
                            disabled={loading}
                            accept=".csv"
                            multiple={true}
                            onChange={handleChangeFile}
                        />
                        <Button
                            disabled={!files || loading}
                            onClick={handleImportFiles}
                            variant={'outline'}
                        >
                            {loading ? (
                                <div className="flex items-center gap-1">
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                    <span>Importando</span>
                                </div>
                            ) : (
                                'Importar'
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
}: {
    bankImport: InferSelectModel<typeof bankImports>
}) {
    return (
        <div className="flex gap-1 items-center border rounded-md p-2">
            <FileIcon className="h-5 w-5" />
            <span className="text-sm">
                {'Importado em ' +
                    format(bankImport.createdAt, 'dd/MM/yyyy HH:mm')}
            </span>
            <div className="flex flex-1 gap-1 justify-end">
                <Button variant={'secondary'}>
                    <ScanEyeIcon />
                </Button>
                <Button variant={'destructive'}>
                    <TrashIcon />
                </Button>
            </div>
        </div>
    )
}
