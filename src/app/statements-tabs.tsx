'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Statement } from '@/lib/types'
import { Label } from '@radix-ui/react-label'
import { Loader } from 'lucide-react'
import { Ofx } from 'ofx-data-extractor'
import type { STRTTRN } from 'ofx-data-extractor/dist/@types/ofx'
import { ChangeEvent, useState } from 'react'
import { getCategories } from './actions'
import { Chart } from './chart'
import StatementsTable from './statements-table'

const testStatements = [
    {
        bank_id: '0260',
        amount: 15,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência Recebida - MYRIAN VICTORIA PIZZI OLIVEIRA 10609795511 - 44.242.341/0001-49 - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 25262378-2',
        fit_id: '660abf24-b085-41fe-91dc-49fc7df6fc5f',
        category: 'Marketing',
    },
    {
        bank_id: '0260',
        amount: 25,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência Recebida - MYRIAN VICTORIA PIZZI OLIVEIRA 10609795511 - 44.242.341/0001-49 - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 25262378-2',
        fit_id: '660abfe3-32a1-412c-819f-72f26d19f472',
        category: 'Marketing',
    },
    {
        bank_id: '0260',
        amount: -28.65,
        balance_amount: 173.62,
        date: '2024-04-01',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '660ac10b-cb63-4992-b2e2-a2a5dff8988c',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -10,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660ac122-7afb-4d82-91ae-9fc15394e5aa',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: 1500,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência recebida pelo Pix - DR PERFORMANCE SYSTEM LTDA ME - 41.549.333/0001-51 - BCO SANTANDER (BRASIL) S.A. (0033) Agência: 1719 Conta: 13001689-2',
        fit_id: '660b0527-081d-44f1-84b4-457828b29e38',
        category: 'Desenvolvimento de Software',
    },
    {
        bank_id: '0260',
        amount: -300,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660b05e9-42eb-4446-a0d5-a4b1cf42dbe8',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -125,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - Brunno Andrade Simões - •••.817.675-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 53001861-3',
        fit_id: '660b0607-630d-4927-a48a-c9d04f390934',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -25,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - Ana Caroline Pimentel Lima de Oliveira - •••.241.635-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 16291902-1',
        fit_id: '660b068b-d4a8-42e4-a8d3-9879c6881fcb',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -77.75,
        balance_amount: 173.62,
        date: '2024-04-01',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '660b0a8e-7ed1-49e2-994f-de2a57665dea',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -92.05,
        balance_amount: 173.62,
        date: '2024-04-01',
        description: 'Pagamento de boleto efetuado - VELOZNET',
        fit_id: '660b1398-621a-4276-b566-d7d64964ae81',
        category: 'Pagamento de Boleto',
    },
    {
        bank_id: '0260',
        amount: -82.7,
        balance_amount: 173.62,
        date: '2024-04-01',
        description: 'Pagamento de boleto efetuado - DESO SERGIPE',
        fit_id: '660b1436-94bb-4068-93f0-950bdadc3534',
        category: 'Pagamento de Boleto',
    },
    {
        bank_id: '0260',
        amount: -87.98,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - ENERGISA - 13.017.462/0001-63 - Banco Citibank S.A. Agência: 1 Conta: 8627406-6',
        fit_id: '660b144e-6e2f-4c3d-8825-5e2c5eef2b16',
        category: 'Serviços Públicos',
    },
    {
        bank_id: '0260',
        amount: -41,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - AGROBARRA COMERCIO PRODUTOS VETERIN - 06.813.859/0001-04 - Banco do Estado de Sergipe S.A. (0047) Agência: 63 Conta: 3100185-6',
        fit_id: '660b152b-5cb6-4ed0-bde9-c8562056429c',
        category: 'Saúde e Bem-Estar',
    },
    {
        bank_id: '0260',
        amount: -150,
        balance_amount: 173.62,
        date: '2024-04-01',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660b2448-5783-49b6-aaae-17c78004db01',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -64.8,
        balance_amount: 173.62,
        date: '2024-04-01',
        description: 'Compra no débito - C.S Sergipe',
        fit_id: '660b2bf6-09fb-4408-b3e1-4fbdf62e8dd2',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -10,
        balance_amount: 173.62,
        date: '2024-04-02',
        description:
            'Transferência enviada pelo Pix - Damarys Pizzi Oliveira - •••.384.525-•• - PICPAY (0380) Agência: 1 Conta: 51009352-3',
        fit_id: '660c25d9-6f07-496d-8979-d23c5c0c375a',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -26.03,
        balance_amount: 173.62,
        date: '2024-04-02',
        description: 'Compra no débito - Hiper Carnes',
        fit_id: '660c8ff8-3484-4463-8ee9-be92df5c545e',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -58.78,
        balance_amount: 173.62,
        date: '2024-04-02',
        description: 'Compra no débito - Pag*Raiadrogasilsa',
        fit_id: '660c92d1-929f-49e9-b5a6-d3e26cd0412d',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -34.6,
        balance_amount: 173.62,
        date: '2024-04-03',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '660d5aa3-3019-4071-b381-9ea717bfb547',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: 20,
        balance_amount: 173.62,
        date: '2024-04-03',
        description:
            'Transferência Recebida - MYRIAN VICTORIA PIZZI OLIVEIRA 10609795511 - 44.242.341/0001-49 - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 25262378-2',
        fit_id: '660d5aa4-7248-4617-8b07-3d87822ebc7b',
        category: 'Marketing',
    },
    {
        bank_id: '0260',
        amount: -10,
        balance_amount: 173.62,
        date: '2024-04-03',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '660d6c29-1b5f-47a6-8125-1046b5b1eda9',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -10,
        balance_amount: 173.62,
        date: '2024-04-03',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660dbad5-72ff-41a4-91e4-8ca9aee070d2',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -11.5,
        balance_amount: 173.62,
        date: '2024-04-03',
        description: 'Compra no débito - C.S Sergipe',
        fit_id: '660dbebf-9781-4065-aa91-cc7884abb176',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -3.25,
        balance_amount: 173.62,
        date: '2024-04-03',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '660dbf8c-778f-4025-8757-d07165a424dd',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -20,
        balance_amount: 173.62,
        date: '2024-04-04',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660ebe9e-3775-436c-98d7-5a5546b5c999',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -12.9,
        balance_amount: 173.62,
        date: '2024-04-04',
        description: 'Compra no débito via NuPay - Uber',
        fit_id: '660ec410-a125-46de-a2fd-a52362b5bf11',
        category: 'Transporte',
    },
    {
        bank_id: '0260',
        amount: -13.97,
        balance_amount: 173.62,
        date: '2024-04-04',
        description: 'Compra no débito via NuPay - Uber',
        fit_id: '660ecc1e-bb6f-4101-b50d-de89bf05d6c8',
        category: 'Transporte',
    },
    {
        bank_id: '0260',
        amount: -4.58,
        balance_amount: 173.62,
        date: '2024-04-04',
        description: 'Compra no débito via NuPay - Uber',
        fit_id: '660ed338-fd6d-4af1-9bf2-ef9cfea3b96d',
        category: 'Transporte',
    },
    {
        bank_id: '0260',
        amount: -4,
        balance_amount: 173.62,
        date: '2024-04-04',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660ed9fc-ef27-400b-9b50-8ae4d616a249',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -18,
        balance_amount: 173.62,
        date: '2024-04-04',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660edd0c-a172-4e3e-a18b-8626f268986d',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -35.2,
        balance_amount: 173.62,
        date: '2024-04-04',
        description: 'Compra no débito - Supermix',
        fit_id: '660f2380-4559-4659-88c2-9e9c390e9ea8',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -25,
        balance_amount: 173.62,
        date: '2024-04-05',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '660f6ddb-7a5e-48e3-9be3-75a365397002',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: 15,
        balance_amount: 173.62,
        date: '2024-04-05',
        description:
            'Transferência Recebida - MYRIAN VICTORIA PIZZI OLIVEIRA 10609795511 - 44.242.341/0001-49 - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 25262378-2',
        fit_id: '661002f3-2432-49d4-be94-d2db0cb1ed9d',
        category: 'Marketing',
    },
    {
        bank_id: '0260',
        amount: -19,
        balance_amount: 173.62,
        date: '2024-04-05',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '6610046e-162b-42dc-9648-3030e9ff3c60',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -30,
        balance_amount: 173.62,
        date: '2024-04-05',
        description:
            'Transferência enviada pelo Pix - Myrian Victória Pizzi Oliveira - •••.097.955-•• - NU PAGAMENTOS - IP (0260) Agência: 1 Conta: 11183217-2',
        fit_id: '66100d04-0eaf-4192-b353-486c44848fc4',
        category: 'Transferência',
    },
    {
        bank_id: '0260',
        amount: -20.75,
        balance_amount: 173.62,
        date: '2024-04-05',
        description: 'Compra no débito - C.S Sergipe',
        fit_id: '66106250-ae90-49e4-bb2e-f4a52d0e47d9',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: 170,
        balance_amount: 173.62,
        date: '2024-04-06',
        description:
            'Transferência recebida pelo Pix - REPRESENTACAO C O LTDA - 09.527.977/0001-36 - BCO DO BRASIL S.A. (0001) Agência: 4495 Conta: 9119-7',
        fit_id: '66119540-9540-487f-a19b-25117d3cc9da',
        category: 'Alimentação',
    },
    {
        bank_id: '0260',
        amount: -6,
        balance_amount: 173.62,
        date: '2024-04-06',
        description:
            'Transferência enviada pelo Pix - 99 TECNOLOGIA LTDA - 18.033.552/0001-61 - ADYEN DO BRASIL IP LTDA. Agência: 1 Conta: 100000015-8',
        fit_id: '66119664-f53d-4bdd-88a4-d18eea8e4e44',
        category: 'Serviços',
    },
    {
        bank_id: '0260',
        amount: -77.2,
        balance_amount: 173.62,
        date: '2024-04-06',
        description: 'Compra no débito - Pag*Rosangelamendonca',
        fit_id: '66119cdc-764e-48fd-b115-0f75d45af828',
        category: 'Shopping',
    },
    {
        bank_id: '0260',
        amount: -35.8,
        balance_amount: 173.62,
        date: '2024-04-06',
        description: 'Compra no débito - Supermix',
        fit_id: '6611c7d4-441a-4b01-aee7-cbe089dd742a',
        category: 'Shopping',
    },
]

export default function StatementsTabs() {
    const [file, setFile] = useState<File | null>(null)
    const [tab, setTab] = useState<'table' | 'chart' | undefined>('table')
    const [statements, setStatements] = useState<Statement[] | undefined>(
        testStatements
    )
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setFile(e.target.files[0])
    }

    const handleImportFile = async () => {
        setLoading(true)
        try {
            if (!file) return
            const blob = await Ofx.fromBlob(file)
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

            const statements: Omit<Statement, 'category'>[] = ofxData
                .splice(0, 15)
                .map((t: STRTTRN) => ({
                    bank_id: bankInfo?.bank_id as string,
                    amount: Number(t.TRNAMT),
                    balance_amount: Number(
                        ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.LEDGERBAL
                            .BALAMT
                    ),
                    date: t.DTPOSTED as unknown as string,
                    description: t.MEMO,
                    fit_id:
                        typeof t.FITID === 'string'
                            ? t.FITID
                            : t.FITID.transactionCode,
                }))
            const statementsWithCategories = await getCategories(statements)
            if (statementsWithCategories.error) {
                toast({
                    title: statementsWithCategories.error,
                    variant: 'destructive',
                })
                return
            }
            if (statementsWithCategories.results) {
                setStatements(statementsWithCategories.results)
                setTab('table')
            }
        } catch {
            setStatements([])
            setLoading(false)
            setTab(undefined)
            toast({
                title: 'Erro ao importar arquivo',
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="w-[1000px]">
            <div>
                <div className="flex flex-col mb-2">
                    <Label
                        htmlFor="file"
                        className="mt-2 font-semibold mb-2 pl-4"
                    >
                        Selecione o arquivo .ofx do extrato bancário para
                        importar
                    </Label>
                    <div className="flex gap-1">
                        <Input
                            id="file"
                            type="file"
                            disabled={loading}
                            onChange={handleChangeFile}
                        />
                        <Button
                            disabled={!file || loading}
                            onClick={handleImportFile}
                            variant={'outline'}
                        >
                            {loading ? (
                                <div className="flex items-center gap-1">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Importando</span>
                                </div>
                            ) : (
                                'Importar'
                            )}
                        </Button>
                    </div>
                </div>
                {!!statements && (
                    <Tabs value={tab}>
                        <div className="flex justify-center">
                            <TabsList>
                                <TabsTrigger
                                    onClick={() => setTab('table')}
                                    value="table"
                                >
                                    Tabela
                                </TabsTrigger>
                                <TabsTrigger
                                    onClick={() => setTab('chart')}
                                    value="chart"
                                >
                                    Gráfico
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="table">
                            <StatementsTable
                                statements={statements as Statement[]}
                            />
                        </TabsContent>
                        <TabsContent value="chart">
                            <Chart statements={statements as Statement[]} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    )
}
