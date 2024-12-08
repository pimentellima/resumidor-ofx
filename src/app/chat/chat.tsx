'use client'
import { Button } from '@/components/ui/button'
import { ChatRequestOptions, Message } from 'ai'
import { useChat } from 'ai/react'
import { ArrowUpIcon, BotIcon } from 'lucide-react'
import { RefObject, useEffect, useRef } from 'react'
import BarChartMultiple from './bar-chart-multiple'
import { PieChartComponent } from './pie-chart'

export default function Chat() {
    const { messages, handleSubmit, handleInputChange, input } = useChat({
        api: '/api/continue-conversation',
    })
    const messageEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        const scrollHeight = messageEndRef.current?.scrollHeight
        if (scrollHeight === 0) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])
    console.log(messages)
    return (
        <div className="pb-4 pt-8 flex flex-col justify-between items-center h-full">
            <div
                className="overflow-auto w-screen pb-6 flex flex-col gap-10
               leading-relaxed items-center"
            >
                {messages.map((message) =>
                    message.role === 'user' ? (
                        <UserMessage
                            key={message.id}
                            content={message.content}
                        />
                    ) : (
                        <BotMessage
                            key={message.id}
                            message={message}
                            isLastMessage={
                                messages.findIndex(
                                    (m) => m.id === message.id
                                ) ===
                                messages.length - 1
                            }
                        />
                    )
                )}
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

function BotMessage({
    message,
    isLastMessage,
}: {
    message: Message
    isLastMessage: boolean
}) {
    const isCallingTool = !!message.toolInvocations?.length
    const hasChart = message.toolInvocations?.some(
        (t) =>
            t.state === 'result' &&
            ['createBarChartMultiple', 'createPieChart'].includes(t.toolName)
    )
    if (isLastMessage && !message.content && isCallingTool)
        return (
            <div className="flex gap-2 relative w-[750px] px-2">
                <div className="absolute -left-14 w-9 h-9 rounded-md border flex justify-center items-center">
                    <BotIcon className="h-5" />
                </div>
                <div className="flex-1">Buscando informações...</div>
            </div>
        )

    if (!message.content && !hasChart) return null
    return (
        <div className="flex gap-2 relative w-[750px] px-2">
            <div className="absolute -left-14 w-9 h-9 rounded-md border flex justify-center items-center">
                <BotIcon className="h-5" />
            </div>
            <div className="flex-1">
                {message.content}
                <div>
                    {message.toolInvocations?.map((toolInvocation) => {
                        const { toolName, state } = toolInvocation
                        if (
                            toolName === 'createBarChartMultiple' &&
                            state === 'result'
                        )
                            return (
                                <BarChartMultiple
                                    key={toolInvocation.toolCallId}
                                    {...toolInvocation.result}
                                />
                            )
                        if (
                            toolName === 'createPieChart' &&
                            state === 'result'
                        ) {
                            return (
                                <PieChartComponent
                                    key={toolInvocation.toolCallId}
                                    {...toolInvocation.result}
                                />
                            )
                        }
                    })}
                </div>
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
            className="flex justify-end items-end flex-col shadow-2xl 
            bg-accent text-accent-foreground rounded-md p-4 pr-3"
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
                bg-transparent focus:outline-none placeholder:text-muted-foreground"
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
        <div className="flex justify-end  w-[750px] px-2 items-center">
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
