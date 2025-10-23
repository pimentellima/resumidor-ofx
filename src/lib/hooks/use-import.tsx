import { toast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useImportMutation(params?: {
    onSuccess?: () => void
    onError?: (error: any) => void
}) {
    const { onSuccess, onError } = params || {}
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['imports'],
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['imports'],
            })
            onSuccess && onSuccess()
            toast({ title: 'Statements imported successfully' })
        },
        onError: (error) => {
            onError && onError(error)
            toast({
                title: 'Error importing statements',
                variant: 'destructive',
            })
        },
        mutationFn: async (files: FileList) => {
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
        },
    })
}
