import { db } from '@/lib/db'
import { accounts, authenticators, users } from '@/lib/db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import { AuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { ACCESS_TOKEN_TTL } from './constants'
import { sendVerificationRequest } from './send-verification-request'
import { obtainAccessToken, refreshAccessToken } from './tokens'

export const authOptions = {
    adapter: DrizzleAdapter(db, {
        accountsTable: accounts,
        usersTable: users,
        authenticatorsTable: authenticators,
    }),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
        verifyRequest: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return '/sign-in?error=missingEmail'
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, user.email),
            })
            if (!existingUser) {
                const [newUser] = await db
                    .insert(users)
                    .values({ email: user.email })
                    .returning()
                user.id = newUser.id
                return true
            }
            user.id = existingUser.id
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.refreshToken = await obtainAccessToken(
                    token.sub as string
                )
                token.expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL)
            }

            const expiresAt = token.expiresAt as Date

            if (new Date() < new Date(expiresAt)) {
                return token
            }

            return await refreshAccessToken(token as any)
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub as string
                session.user.name = token.name
                session.user.email = token.email
            }

            return session
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT!),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            sendVerificationRequest,
        }),
    ],
} satisfies AuthOptions

export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}
