'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { generatePdfPages } from '@/lib/pdf'
import { LoaderIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

export function SelectFile() {
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setFile(e.target.files[0])
    }

    const handleImportFile = async () => {
        if (!file) return
        setLoading(true)
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)

        reader.onload = async () => {
            const arrayBuffer = reader.result

            try {
                const pages = await generatePdfPages(arrayBuffer as ArrayBuffer)
                const response = await fetch('/api/generate-embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pages }),
                })

                if (!response.ok) {
                    toast({
                        title: 'Error',
                        variant: 'destructive',
                    })
                }
                router.push(response.url)
            } catch (error) {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                })
            } finally {
                setLoading(false)
            }
        }
    }
    return (
        <div className="flex flex-col mb-2">
            <Label htmlFor="file" className="mt-2 font-semibold mb-2 pl-4">
                Selecione o arquivo .pdf ou .ofx do extrato bancário para
                importar
            </Label>
            <div className="flex gap-1">
                <Input
                    id="file"
                    type="file"
                    disabled={loading}
                    onChange={handleChangeFile}
                />
                <Button
                    disabled={!file || loading}
                    onClick={handleImportFile}
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
    )
}
