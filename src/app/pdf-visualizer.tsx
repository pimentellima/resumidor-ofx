'use client'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { LoaderCircle } from 'lucide-react'

export default function PdfVisualizer({
    url,
    loading,
    translated,
}: {
    url: string
    loading: boolean
    translated: boolean
}) {
    if (loading) {
        return (
            <div className="h-[750px] mt-3">
                <div className="flex items-center justify-center h-full bg-white rounded-sm">
                    <LoaderCircle className="duration-1000 h-7 w-7 animate-spin" />
                </div>
            </div>
        )
    }

    if (!translated)
        return (
            <div className="h-[750px] mt-3">
                <div className="flex items-center justify-center h-full text-sm font-medium bg-white rounded-sm">
                    The translated document will show here
                </div>
            </div>
        )

    return (
        <>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div className="h-[750px] mt-3">
                    <Viewer
                        renderError={(error) => (
                            <div className="flex items-center justify-center h-full bg-white rounded-sm">
                                <p className="text-sm text-destructive">
                                    Failed to fetch document
                                </p>
                            </div>
                        )}
                        renderLoader={() => (
                            <div className="flex items-center justify-center h-full bg-white rounded-sm">
                                <LoaderCircle className="duration-1000 h-7 w-7 animate-spin" />
                            </div>
                        )}
                        enableSmoothScroll={true}
                        fileUrl={url}
                        // plugins={[defaultLayoutPluginInstance]}
                    />
                </div>
            </Worker>
        </>
    )
}
