'use client'
import { Button } from '@/components/ui/button'
import { ChatRequestOptions, CreateMessage, Message } from 'ai'
import { useChat } from 'ai/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useQueryClient } from 'react-query'
import BarChartMultiple from '../../../components/bar-chart-multiple'
import { PieChartComponent } from '../../../components/pie-chart'
import { ImportStatementsInput } from './components/import-statements-input'
import InputBubble from './components/input-bubble'

export default function Chat({
    id,
    initialMessages,
    hasUserImports,
}: {
    id: string
    initialMessages?: Array<Message>
    hasUserImports?: boolean
}) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { messages, handleSubmit, handleInputChange, input, append } =
        useChat({
            api: '/api/continue-conversation',
            id,
            onFinish: async () => {
                if (messages.length === 0) {
                    await queryClient.refetchQueries(['history'])
                    router.push('/chat/' + id)
                }
            },
            body: {
                id,
            },
            initialMessages,
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

    return (
        <div className="w-full flex flex-col justify-between items-center h-full">
            <div className="overflow-auto w-full flex justify-center mb-10 ">
                <div
                    className="flex flex-col gap-10
                   leading-relaxed items-center w-[750px] relative"
                >
                    {!hasUserImports ? (
                        <ImportStatementsInput />
                    ) : messages.length === 0 ? (
                        <QuestionPrompts appendMessage={append} />
                    ) : (
                        messages.map((message) =>
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
                        )
                    )}
                    <div ref={messageEndRef} />
                </div>
            </div>
            <div className="w-[750px]">
                <InputBubble
                    disabled={!hasUserImports}
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
            <div className="flex gap-2 w-full px-2">
                <div className="flex-1">Buscando informações...</div>
            </div>
        )

    if (!message.content && !hasChart) return null
    return (
        <div className="flex gap-2 w-full px-2">
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

function UserMessage({ content }: { content: string }) {
    return (
        <div className="flex justify-end w-full px-2 items-center">
            <div className="text-right py-2 px-4 rounded-md bg-background border">
                {content}
            </div>
        </div>
    )
}

function QuestionPrompts({
    appendMessage,
}: {
    appendMessage: (
        message: Message | CreateMessage,
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>
}) {
    return (
        <div className="grid gap-1 grid-cols-2">
            <QuestionButton
                appendMessage={appendMessage}
                question="Com que eu mais gastei no mês de janeiro?"
            />
            <QuestionButton
                appendMessage={appendMessage}
                question="Faça um gráfico comparando os gastos com alimentação e transporte desse mês."
            />
            <QuestionButton
                appendMessage={appendMessage}
                question="Quanto eu gastei com transporte no mês passado?"
            />
            <QuestionButton
                appendMessage={appendMessage}
                question="Mostre o meu gasto com lazer ao longo do ano."
            />
        </div>
    )
}

function QuestionButton({
    question,
    appendMessage,
}: {
    question: string
    appendMessage: (
        message: Message | CreateMessage,
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>
}) {
    return (
        <Button
            onClick={() => appendMessage({ content: question, role: 'user' })}
            size="lg"
            variant={'outline'}
            className="text-wrap h-14"
        >
            {question}
        </Button>
    )
}
