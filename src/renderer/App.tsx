import React, { useEffect, useState } from 'react'
import Chart from './component/Chart'
import PersonalBests from './component/PersonalBests'
import CustomCalendar from './component/Calendar'
import Journal from './component/Journal'
import SavedTrades from './component/SavedTrades'

interface ParsedRow {
    date: number // Timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    token: string
}

interface TradeBalance {
    date: number // Use a timestamp as expected by the Chart
    balance: number
}

function App() {
    const [data, setData] = useState<ParsedRow[]>([])
    const [chartData, setChartData] = useState<TradeBalance[]>([])
    const [totalAccountValue, setTotalAccountValue] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)

    const fetchTrades = async () => {
        try {
            const trades: any[] =
                await window.electron.ipcRenderer.invoke('read-trades-file')

            const parsedTrades: ParsedRow[] = trades
                .map((trade) => {
                    const dateString = trade.time?.trim()
                    if (!dateString) return null

                    const isoDateString = dateString.replace(' ', 'T') + 'Z'
                    const date = new Date(isoDateString)

                    if (isNaN(date.getTime())) return null

                    return {
                        date: date.getTime(), // Convert time to timestamp
                        balanceBefore: trade.balance_before,
                        balanceAfter: trade.balance_after,
                        realizedPnlValue: trade.realized_pnl,
                        realizedPnlCurrency: trade.currency,
                        token: trade.token || '', // Default empty string for missing token
                        tpHit: trade.tpHit ?? false, // Default to false if undefined
                        slHit: trade.slHit ?? false,
                        panicClose: trade.panicClose ?? false,
                        fomoEnter: trade.fomoEnter ?? false,
                        followedRules: trade.followedRules ?? false,
                    }
                })
                .filter((trade) => trade !== null) as ParsedRow[]

            setData(parsedTrades)

            const transformedData: TradeBalance[] = parsedTrades.map(
                (trade) => ({
                    date: trade.date,
                    balance: trade.balanceAfter,
                })
            )

            setChartData(transformedData)

            if (parsedTrades.length > 0) {
                const lastBalance =
                    parsedTrades[parsedTrades.length - 1].balanceAfter
                const firstBalance = parsedTrades[0].balanceBefore

                setTotalAccountValue(lastBalance)
                setTotalProfit(lastBalance - firstBalance)
            }
        } catch (err) {
            console.error('Error fetching trades:', err)
        }
    }

    useEffect(() => {
        fetchTrades()
    }, [data])

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Trading Data Visualizer</h1>
            </header>
            {chartData.length > 0 ? (
                <main className="app-main">
                    <section className="summary-section">
                        <h2>Balance Over Time</h2>
                        <div className="summary-metrics">
                            <PersonalBests
                                data={data}
                                accountSize={totalAccountValue}
                                currentProfit={totalProfit}
                            />
                        </div>
                    </section>
                    <section className="chart-section">
                        <Chart data={chartData} />
                        <div className="form-container">
                            <Journal
                                totalAccountValue={totalAccountValue}
                                onSubmit={fetchTrades}
                            />
                        </div>
                    </section>
                    <section className="info-section">
                        <div className="calendar-container">
                            <CustomCalendar data={data} />
                        </div>
                        <div className="journal-container">
                            <SavedTrades trades={data} />
                        </div>
                    </section>
                </main>
            ) : (
                <div className="no-data">
                    <p>Loading data...</p>
                </div>
            )}
        </div>
    )
}

export default App
