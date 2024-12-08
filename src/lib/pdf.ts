import pdf from 'pdf-parse/lib/pdf-parse'
// import 'pdfjs-dist/build/pdf.worker.mjs'

export async function extractTextFromPdf(fileBuffer: Buffer) {
    return (await pdf(fileBuffer)).text
}
