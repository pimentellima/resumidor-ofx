'use client'
import { ToastProvider } from '@radix-ui/react-toast'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
        >
            <ToastProvider>{children}</ToastProvider>
        </NextThemesProvider>
    )
}
