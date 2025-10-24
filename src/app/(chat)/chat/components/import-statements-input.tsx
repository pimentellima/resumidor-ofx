'use client'
import { Button } from '@/components/ui/button'
import useImportMutation from '@/lib/hooks/use-import'

export function ImportStatementsInput() {
    const { mutate, isPending } = useImportMutation()

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        mutate(e.target.files)
    }
    return (
        <>
            <input
                className="hidden"
                id="file"
                type="file"
                disabled={isPending}
                accept=".csv"
                onChange={handleChangeFile}
                multiple={true}
            />
            <Button disabled={isPending} asChild size="lg" variant="default">
                <label htmlFor="file">Import statement files to start</label>
            </Button>
        </>
    )
}
