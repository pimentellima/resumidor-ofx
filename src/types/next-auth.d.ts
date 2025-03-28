import { DefaultSession } from 'next-auth'

export type User = {
    id: string
} & DefaultSession['user']

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        user: User
    }
}
