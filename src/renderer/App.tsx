import React, { useEffect, useState } from 'react'
import Chart from './component/Chart'
import TradingPieChart from './component/PieChart'
import PersonalBests from './component/PersonalBests'
import CustomCalendar from './component/Calendar'
import Journal from './component/Journal'

interface ParsedRow {
    date: number // Timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    action: string
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

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                // Fetch the trades data from the main process
                const trades: any[] =
                    await window.electron.ipcRenderer.invoke('read-trades-file')

                // Transform and validate the data
                const parsedTrades: ParsedRow[] = trades
                    .map((trade) => {
                        const dateString = trade.time?.trim()

                        if (!dateString) {
                            console.error(
                                'Missing date string in trade:',
                                trade
                            )
                            return null
                        }

                        const isoDateString = dateString.replace(' ', 'T') + 'Z'
                        const date = new Date(isoDateString)

                        if (isNaN(date.getTime())) {
                            console.error(
                                'Invalid Date:',
                                isoDateString,
                                'Original:',
                                dateString
                            )
                            return null
                        }

                        return {
                            date: date.getTime(), // Convert to timestamp
                            balanceBefore: trade.balance_before,
                            balanceAfter: trade.balance_after,
                            realizedPnlValue: trade.realized_pnl,
                            realizedPnlCurrency: trade.currency,
                            action: '', // Default to empty if no token
                        }
                    })
                    .reverse()
                    .filter((trade) => trade !== null) as ParsedRow[] // Filter out invalid entries

                setData(parsedTrades)

                // Transform for Chart component
                const transformedData: TradeBalance[] = parsedTrades.map(
                    (trade) => ({
                        date: trade.date,
                        balance: trade.balanceAfter,
                    })
                )

                setChartData(transformedData)

                // Calculate totals
                if (parsedTrades.length > 0) {
                    const lastBalance =
                        parsedTrades[parsedTrades.length - 1].balanceAfter
                    const firstBalance = parsedTrades[0].balanceBefore

                    const profit = Math.floor(lastBalance - firstBalance)

                    setTotalAccountValue(lastBalance)
                    setTotalProfit(profit)
                }
            } catch (error) {
                console.error('Error fetching trades:', error)
            }
        }

        fetchTrades()
    }, [])

    console.log(data)

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
                            <h3>
                                Total Account Value: $
                                {totalAccountValue.toFixed(2)}
                            </h3>
                            <h3>
                                Total Profit / Loss: ${totalProfit.toFixed(2)}
                            </h3>
                            <PersonalBests data={data} />
                        </div>
                    </section>
                    <section className="chart-section">
                        <Chart data={chartData} />
                        <div className="form-container">
                            <Journal
                                totalAccountValue={totalAccountValue}
                                onSubmit={(formData) => {
                                    console.log('Trade logged:', formData)
                                }}
                            />
                        </div>
                    </section>
                    <section className="info-section">
                        <section className="info-section">
                            <div className="calendar-container">
                                <CustomCalendar data={data} />
                            </div>
                            <div className="piechart-container">
                                <TradingPieChart data={data} />
                            </div>
                        </section>
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
