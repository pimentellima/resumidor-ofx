import * as PDFJS from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.mjs'
import { TextItem } from 'pdfjs-dist/types/src/display/api'

export async function generatePdfPages(arrayBuffer: ArrayBuffer) {
    const buffer = Buffer.from(arrayBuffer)
    let doc = await PDFJS.getDocument(buffer).promise
    const pages: string[] = []
    const totalPages = doc.numPages
    for (let i = 1; i <= totalPages; i++) {
        const page = await doc.getPage(i)
        const content = await page.getTextContent()
        const str = content.items.map((item) => (item as TextItem).str)
        if (str.length > 0) {
            pages.push(str.join(' '))
        }
    }
    return pages
}
