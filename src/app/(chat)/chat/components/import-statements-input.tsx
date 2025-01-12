'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ImportIcon } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

export function ImportStatementsInput() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) {
            return
        }
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

            toast({
                title: 'Extratos importados com sucesso',
                variant: 'destructive',
            })
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
        <>
            <input
                className="hidden"
                id="file"
                type="file"
                disabled={loading}
                accept=".csv"
                multiple={true}
                onChange={handleChangeFile}
            />
            <Button
                disabled={loading}
                asChild
                size="lg"
                className="h-14"
                variant="default"
            >
                <label htmlFor="file">
                    Importe os extratos do seu banco para começar
                    <ImportIcon />
                </label>
            </Button>
        </>
    )
}
