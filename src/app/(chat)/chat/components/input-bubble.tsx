'use client'

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from '@/components/ui/input-group'

import { ArrowUpIcon } from 'lucide-react'

export default function InputBubble({
    handleSubmit,
    input,
    handleInputChange,
    disabled,
}: {
    handleSubmit: () => void
    input: string
    handleInputChange: (text: string) => void
    disabled?: boolean
}) {
    return (
        <InputGroup>
            <InputGroupTextarea
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                    }
                }}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Ask something"
            />
            <InputGroupAddon align="block-end" className="border-t">
                <InputGroupButton
                    onClick={() => {
                        handleSubmit()
                    }}
                    disabled={disabled}
                    size="sm"
                    className="ml-auto"
                    variant="default"
                >
                    Send <ArrowUpIcon />
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
}
