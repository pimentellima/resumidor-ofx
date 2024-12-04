import { generateEmbeddings } from '@/lib/ai/embedding'
import { db } from '@/lib/db'
import { embeddings as embeddingsTable, resources } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const json = await request.json()
    if (!json.pages) {
        return new Response('Error, please try again.', { status: 400 })
    }
    const pdfPages: string[] = json.pages

    try {
        const [resource] = await db
            .insert(resources)
            .values({ content: pdfPages.join('\n') })
            .returning()
        const embeddings = await generateEmbeddings(pdfPages)
        await db.insert(embeddingsTable).values(
            embeddings.map((embedding) => ({
                resourceId: resource.id,
                ...embedding,
            }))
        )
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/${resource.id}`
        )
    } catch (e) {
        console.log(e)
        const message =
            e instanceof Error && e.message.length
                ? e.message
                : 'Error, please try again.'
        return new Response(message, { status: 500 })
    }
}
