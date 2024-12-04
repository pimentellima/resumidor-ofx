'use client'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@radix-ui/react-toast'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
        >
            <ToastProvider>
                <Toaster />
                {children}
            </ToastProvider>
        </NextThemesProvider>
    )
}
