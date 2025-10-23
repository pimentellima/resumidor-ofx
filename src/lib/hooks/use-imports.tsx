import { useQuery } from '@tanstack/react-query'

async function fetchUserImports() {
    const response = await fetch('/api/imports')
    if (!response.ok) throw new Error('Failed to fetch user imports')
    return await response.json()
}
export default function useImports() {
    return useQuery({
        queryKey: ['imports'],
        queryFn: fetchUserImports,
    })
}
