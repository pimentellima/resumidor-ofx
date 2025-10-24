import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '../actions/history'

export default function useHistory() {
    return useQuery({
        queryKey: ['history'],
        queryFn: async () => getChatHistory(),
    })
}
