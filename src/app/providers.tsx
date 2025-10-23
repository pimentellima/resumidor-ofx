'use client'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
        >
            <ToastProvider>
                <Toaster />
                <QueryClientProvider client={queryClient}>
                    <SessionProvider>{children}</SessionProvider>
                </QueryClientProvider>
            </ToastProvider>
        </NextThemesProvider>
    )
}
