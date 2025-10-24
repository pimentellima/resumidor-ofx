'use client'
import { Button } from '@/components/ui/button'

export function ImportStatementsInput() {
    return (
        <>
            <input
                className="hidden"
                id="file"
                type="file"
                // disabled={isPending}
                accept=".csv"
                multiple={true}
            />
            <Button asChild size="lg" variant="default">
                <label htmlFor="file">Import statement files to start</label>
            </Button>
        </>
    )
}
