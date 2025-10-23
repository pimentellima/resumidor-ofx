'use client'
import { Button } from '@/components/ui/button'
import useImportMutation from '@/lib/hooks/use-import'

export function ImportStatementsInput() {
    const { mutate, isPending } = useImportMutation()
    return (
        <>
            <input
                className="hidden"
                id="file"
                type="file"
                disabled={isPending}
                accept=".csv"
                multiple={true}
                onChange={(e) => mutate(e.target.files!)}
            />
            <Button disabled={isPending} asChild size="lg" variant="default">
                <label htmlFor="file">Import statement files to start</label>
            </Button>
        </>
    )
}
