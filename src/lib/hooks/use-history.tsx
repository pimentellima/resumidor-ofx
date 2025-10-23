import { useQuery } from '@tanstack/react-query'

async function fetchUserHistory() {
    const response = await fetch('/api/history')
    if (!response.ok) throw new Error('Failed to fetch user history')
    return await response.json()
}
export default function useHistory() {
    return useQuery({
        queryKey: ['history'],
        queryFn: fetchUserHistory,
    })
}
