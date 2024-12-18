interface ParsedRow {
    date: number // Timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    token: string
}

interface CalendarProps {
    data: ParsedRow[]
}

interface TradeFormData {
    symbol: string
    followedRules: boolean
    pnlValue: number
    tpHit: boolean
    slHit: boolean
    panicClose: boolean
    fomoEnter: boolean
}

interface TradeFormProps {
    totalAccountValue: number
    onSubmit: () => void
}

interface TradingData {
    data: ParsedRow[]
    accountSize: number
    currentProfit: number
}

interface WinsAndLosses {
    wins: number
    losses: number
}

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    token: string
    tpHit?: boolean
    slHit?: boolean
    panicClose?: boolean
    fomoEnter?: boolean
    followedRules?: boolean
}

interface JournalProps {
    trades: ParsedRow[]
}

interface TradeBalance {
    date: number // Timestamp of the trade
    balance: number // Account balance after the trade
}

export {
    TradeBalance,
    ParsedRow,
    JournalProps,
    WinsAndLosses,
    TradingData,
    TradeFormProps,
    TradeFormData,
    CalendarProps,
}
