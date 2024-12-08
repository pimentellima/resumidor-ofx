'use server'

import { db } from '@lib/db/index'
import { generateEmbeddings } from '../ai/embedding'
import { embeddings as embeddingsTable, resources } from '../db/schema'

export const createResource = async (content: string) => {
    try {
        if (typeof content !== 'string')
            throw new Error('Content must be a string.')

        const [resource] = await db
            .insert(resources)
            .values({ content })
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
