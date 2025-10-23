'use server'

import { db } from '@lib/db/index'
import { generateEmbeddings } from '../ai/embedding'
import { auth } from '../auth'
import { embeddings as embeddingsTable, resources } from '../db/schema'

export const createResource = async (content: string) => {
    try {
        const session = await auth()
        if (!session?.user) throw new Error('Unauthorized')
        if (typeof content !== 'string')
            throw new Error('Content must be a string.')

        const [resource] = await db
            .insert(resources)
            .values({ content, userId: session.user.id })
            .returning()

        const embeddings = await generateEmbeddings(content)
        await db.insert(embeddingsTable).values(
            embeddings.map((embedding) => ({
                resourceId: resource.id,
                ...embedding,
            }))
        )

        return 'Resource successfully created.'
    } catch (e) {
        if (e instanceof Error)
            return e.message.length > 0 ? e.message : 'Error, please try again.'
    }
}
