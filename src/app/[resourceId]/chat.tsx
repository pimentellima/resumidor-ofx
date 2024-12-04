'use client'
import { Button } from '@/components/ui/button'
import { ChatRequestOptions } from 'ai'
import { useChat } from 'ai/react'
import { ArrowUpIcon, BotIcon } from 'lucide-react'
import { RefObject, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BarChartMultiple from './bar-chart-multiple'

export default function Chat() {
    const { messages, handleSubmit, handleInputChange, input } = useChat({
        api: '/api/continue-conversation',
    })
    const messageEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        console.log('scrolling')
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="pb-4 pt-8 flex flex-col justify-between items-center h-full">
            <div
                className="overflow-auto w-screen pb-6 flex flex-col gap-10
               leading-relaxed items-center"
            >
                {messages.map((message) => (
                    <div
                        className="w-[750px] px-2"
                        key={message.id}
                        id={message.id}
                    >
                        {message.role === 'user' ? (
                            <UserMessage content={message.content} />
                        ) : (
                            <div className="flex gap-2 w-full relative">
                                <div className="absolute -left-14 w-9 h-9 rounded-md border flex justify-center items-center">
                                    <BotIcon className="h-5" />
                                </div>
                                <div className="flex-1">
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </Markdown>
                                    <div>
                                        {message.toolInvocations?.map(
                                            (toolInvocation) => {
                                                const { toolName, state } =
                                                    toolInvocation
                                                if (
                                                    toolName ===
                                                    'createBarChartMultiple'
                                                ) {
                                                    if (state === 'result')
                                                        return (
                                                            <BarChartMultiple
                                                                data={
                                                                    toolInvocation.result
                                                                }
                                                            />
                                                        )
                                                    return (
                                                        <p>Gerando dados...</p>
                                                    )
                                                }
                                                if (
                                                    toolName ===
                                                        'getInformation' &&
                                                    message.content === ''
                                                ) {
                                                    return (
                                                        <p>
                                                            Obtendo informações
                                                            do extrato...
                                                        </p>
                                                    )
                                                }
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="w-[750px]">
                <InputBubble
                    scrollRef={messageEndRef}
                    scrollToBottom={scrollToBottom}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    input={input}
                />
            </div>
        </div>
    )
}

function InputBubble({
    handleSubmit,
    scrollToBottom,
    input,
    handleInputChange,
    scrollRef,
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
    scrollRef: RefObject<HTMLDivElement>
}) {
    return (
        <form
            className="flex justify-end items-end flex-col shadow-2xl bg-accent rounded-md p-4 pr-3"
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
                onChange={handleInputChange}
                rows={2}
                placeholder="Digite sua pergunta (max 1000 caractéres)"
                maxLength={1000}
                className="resize-none !text-base pb-6 w-full 
                bg-transparent focus:outline-none"
            />
            <button
                type="submit"
                disabled={!input}
                className="rounded-full mb-2 mr-2 bg-accent-foreground w-9 h-9
                flex justify-center items-center hover:opacity-80 transition-opacity 
                disabled:opacity-60 disabled:cursor-default"
            >
                <ArrowUpIcon className="text-accent h-6" />
            </button>
        </form>
    )
}

function UserMessage({ content }: { content: string }) {
    return (
        <div className="flex justify-end items-center">
            <div className="text-right py-2 px-4 rounded-md bg-accent">
                {content}
            </div>
        </div>
    )
}

function EmptyChat() {
    return (
        <div className="flex justify-center flex-wrap gap-1">
            <QuestionButton question="Qual foi o meu saldo entre os dias 15 e 24?" />
            <QuestionButton question="Quanto eu gastei com transporte nas duas primeiras semanas?" />
            <QuestionButton question="Eu paguei a internet esse mês?" />
            <QuestionButton question="Faça um resumo dos gastos com lazer." />
        </div>
    )
}

function QuestionButton({ question }: { question: string }) {
    return <Button variant={'outline'}>{question}</Button>
}
