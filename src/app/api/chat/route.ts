import { tools } from '@/lib/ai/tools'
import { auth } from '@/lib/auth'
import { saveChat } from '@/lib/chat/save-chat'
import { openai } from '@ai-sdk/openai'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'

export async function POST(request: Request) {
    const { messages, id } = await request.json()
    const session = await auth()
    if (!session?.user.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    const modelMessages = convertToModelMessages(messages)

    const result = streamText({
        model: openai('gpt-4.1-mini'),
        tools,
        system: `Your job is to check your knowledge base, generate a query and query the database before answering any questions.
        Only respond to questions using information from tool calls.

        Como uma LLM, você deve identificar, registrar e utilizar informações fornecidas pelo usuário para construir contexto relevante. Qualquer dado adicional, como "Laila é amiga do usuário", deve ser armazenado e associado ao usuário. As informações devem ser interpretadas como verdadeiras a menos que explicitamente sinalizado como hipotéticas ou indesejadas para armazenamento. Sempre respeite a privacidade e siga as seguintes regras:

        1. Identifique informações pessoais ou contextuais que possam ser úteis para construir um contexto mais rico nas interações subsequentes.
        - Exemplo: "Procure uma transação do meu trabalho na empresa DEVELOPER TOOLS XYZ" → Registre "O usuário é desenvolvedor."
        - Exemplo: "Procure uma transação do meu amigo João" → Registre "João é amigo do usuário."
        2. Relacione dados às solicitações sempre que relevante, mas apenas quando estas informações forem explicitamente referenciadas pelo usuário.
        3. Evite armazenar dados sensíveis, como informações financeiras ou identificadores pessoais, a menos que autorizado.
        4. Antes de usar qualquer dado armazenado, confirme se ele ainda é relevante para a interação atual.
        5. Os dados registrados devem ser usados para oferecer respostas mais personalizadas, respeitando o objetivo da conversa.
        Se o usuário solicitar para revisar, editar ou excluir dados armazenados, cumpra imediatamente a solicitação.
        
        If you don't have the information, you will ask the user for it and then add the information to your knowledge base.
        The table schema is as follows:
        statements (
            id VARCHAR(191) PRIMARY KEY DEFAULT generateId(), 
            date DATE NOT NULL,
            description TEXT,
            amount NUMERIC NOT NULL
        );
        Only retrieval queries are allowed.        

        When you use the ILIKE operator, convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(description) ILIKE LOWER('%search_term%').
        You will respond based on information retrieved from the database.
        
        Quando você gerar um chart, não precisa listar as informações novamente, só diga que gerou o chart de maneira curta.`,
        messages: modelMessages,
        stopWhen: stepCountIs(10),
        onFinish: async ({ response }) => {
            try {
                await saveChat({
                    id: id,
                    messages: [...modelMessages, ...response.messages],
                    userId: session.user.id,
                })
            } catch (error) {
                console.log(error)
                console.error('Failed to save chat')
            }
        },
    })

    return result.toUIMessageStreamResponse()
}
