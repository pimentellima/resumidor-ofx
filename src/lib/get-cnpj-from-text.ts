export function getCnpjFromText(text: string) {
    const regex = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/
    const match = text.match(regex)
    if (!match?.[0]) return null
    return match[0].replace(',', '').replace('/', '')
}
