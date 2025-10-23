import { db } from '@/lib/db'
import { refreshTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { JWT } from 'next-auth/jwt'
import 'server-only'
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants'

const TOKEN_TTL = 2 * 24 * 60 * 60 * 1000

export async function obtainAccessToken(userId: string) {
    const refreshToken = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.userId, userId),
    })
    if (!refreshToken) {
        const [token] = await db
            .insert(refreshTokens)
            .values({
                expires: new Date(Date.now() + TOKEN_TTL),
                userId,
            })
            .returning()
        return token
    }
    const [extendedToken] = await db
        .update(refreshTokens)
        .set({
            expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })
        .where(eq(refreshTokens.token, refreshToken.token))
        .returning()
    return extendedToken
}

export async function refreshAccessToken(
    token: JWT & { refreshToken: { token: string } }
) {
    const tokenInDb = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, token.refreshToken.token),
    })
    if (!tokenInDb) {
        throw new Error('Refresh token not found')
    }

    if (new Date() > tokenInDb.expires) {
        throw new Error('Refresh token expired')
    }

    const newToken = {
        ...token,
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL),
    }

    return newToken
}
