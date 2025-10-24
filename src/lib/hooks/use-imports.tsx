import { useQuery } from '@tanstack/react-query'
import { getImports } from '../actions/imports'

export default function useImports() {
    return useQuery({
        queryKey: ['imports'],
        queryFn: getImports,
    })
}
