export async function getBusinessInfoByCnpj(cnpj: string) {
    try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
        const data = await res.json()
        return (data as any).cnae_fiscal_descricao as string
    } catch {
        return null
    }
}
