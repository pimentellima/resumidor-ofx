'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ChangeEvent, useState } from 'react'
import { Ofx } from 'ofx-data-extractor'
import type { STRTTRN } from 'ofx-data-extractor/dist/@types/ofx'
import { useToast } from '@/components/ui/use-toast'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

type Statement = {
    amount: number
    description: string
    date: Date
    bank_id: string
    balance_amount: number
    fit_id: string
    transaction_id?: string
}

function formatDate(date: string): Date {
    const [year, month, day] = date.split('-').map((i) => Number.parseInt(i))
    return new Date(year, month - 1, day, 0, 0)
}

export default function StatementsTable() {
    const [statements, setStatements] = useState<Statement[]>([])
    const { toast } = useToast()

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) {
                setStatements([])
                return
            }
            const blob = await Ofx.fromBlob(e.target.files[0])
            const ofxResponse = blob.toJson()
            const bankInfo = {
                account_id:
                    ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM
                        .ACCTID,
                bank_id:
                    ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM
                        .BANKID,
            }
            const ofxData =
                ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST
                    .STRTTRN
            setStatements(
                ofxData.map((t: STRTTRN) => ({
                    bank_id: bankInfo?.bank_id as string,
                    amount: Number(t.TRNAMT),
                    balance_amount: Number(
                        ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.LEDGERBAL
                            .BALAMT
                    ),
                    date: formatDate(t.DTPOSTED as unknown as string),
                    description: t.MEMO,
                    fit_id:
                        typeof t.FITID === 'string'
                            ? t.FITID
                            : t.FITID.transactionCode,
                }))
            )
        } catch {
            setStatements([])
            toast({
                title: 'Erro ao importar arquivo',
            })
        }
    }

    const columns: ColumnDef<Statement>[] = [
        {
            header: 'Data',
            cell: ({ row }) => format(row.original.date, 'dd/MM/yyyy'),
        },
        {
            header: 'Descrição',
            cell: ({ row }) => (
                <p
                    title={row.original.description}
                    className="max-w-48 overflow-hidden text-ellipsis line-clamp-2"
                >
                    {row.original.description}
                </p>
            ),
        },
        {
            header: 'Valor',
            cell: ({ row }) => (
                <p
                    className={`${
                        row.original.amount >= 0
                            ? 'text-green-600'
                            : 'text-red-500'
                    } font-semibold`}
                >
                    {row.original.amount}
                </p>
            ),
        },
    ]
    return (
        <Table>
            <TableCaption>Lista de extratos bancários</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
