'use client'

import { ChatRequestOptions } from 'ai'
import { ArrowUpIcon } from 'lucide-react'

export default function InputBubble({
    handleSubmit,
    scrollToBottom,
    input,
    handleInputChange,
    disabled,
}: {
    handleSubmit: (
        event?: {
            preventDefault?: () => void
        },
        chatRequestOptions?: ChatRequestOptions
    ) => void
    scrollToBottom: () => void
    input: string
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    disabled?: boolean
}) {
    return (
        <form
            data-disabled={disabled}
            className="flex justify-end items-end flex-col shadow-2xl 
            bg-background text-foreground rounded-md p-4 pr-3 border data-[disabled=true]:opacity-70"
            onSubmit={handleSubmit}
        >
            <textarea
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                        scrollToBottom()
                    }
                }}
                value={input}
                disabled={disabled}
                onChange={handleInputChange}
                rows={2}
                placeholder="Digite sua pergunta (max 1000 caractéres)"
                maxLength={1000}
                className="resize-none !text-base pb-6 w-full 
                bg-transparent focus:outline-none placeholder:text-muted-foreground"
            />
            <button
                title="Enviar mensagem"
                type="submit"
                disabled={!input || disabled}
                className="rounded-full mb-2 mr-2 bg-accent-foreground w-9 h-9
                flex justify-center items-center hover:opacity-80 transition-opacity 
                disabled:opacity-60 disabled:cursor-default"
            >
                <ArrowUpIcon className="text-accent h-6" />
            </button>
        </form>
    )
}
