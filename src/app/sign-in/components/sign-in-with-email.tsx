'use client'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
    email: z.string().email(),
})
export default function SignInWithEmail() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    })
    const isLoading = form.formState.isSubmitting
    const callbackUrl = process.env.NEXT_PUBLIC_URL! + '/chat'

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await signIn('email', {
                email: data.email,
                redirect: false,
            })
            toast({
                title: 'Check your email',
                description: 'We have sent you a sign-in link.',
            })
        } catch (error) {
            if (error) {
                form.setError('root', {
                    message: 'Error sending sign-in link.',
                })
                return
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input
                                    className="bg-background"
                                    placeholder="email@dominio.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <div className="flex gap-1">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending email...' : 'Send email'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
