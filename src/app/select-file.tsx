'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { LoaderIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

export function SelectFile() {
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

            router.push('/chat')
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
        <div className="flex flex-col mb-2">
            <Label htmlFor="file" className="mt-2 font-semibold mb-2 pl-4">
                Selecione o arquivo .csv do extrato bancário para importar
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
    )
}
