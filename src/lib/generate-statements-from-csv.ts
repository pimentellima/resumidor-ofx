export function generateStatementsFromCsv(csv: string) {
    const convertDate = (date: string) => {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
    }

    const rows = csv.split('\n')
    const headers = rows[0].split(',')
    const descriptionIndex = headers.findIndex(
        (h) =>
            h.toLowerCase().includes('descricao') ||
            h.toLowerCase().includes('descrição')
    )
    const amountIndex = headers.findIndex((h) =>
        h.toLowerCase().includes('valor')
    )
    const dateIndex = headers.findIndex((h) => h.toLowerCase().includes('data'))
    const data = []
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',')
        if (row.length < 3) {
            continue
        }
        data.push({
            date: convertDate(row[dateIndex]),
            description: row[descriptionIndex],
            amount: row[amountIndex],
        })
    }
    return data
}
