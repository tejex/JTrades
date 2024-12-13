import React, { useEffect, useState } from 'react'
import UploadCSV from './component/UploadCSV'
import Chart from './component/Chart'
import TradingPieChart from './component/PieChart'
import PersonalBests from './component/PersonalBests'
import CustomCalendar from './component/Calendar'

interface ParsedRow {
    date: number
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    action: string
}

function App() {
    const [data, setData] = useState<ParsedRow[]>([])
    const [totalAccountValue, setTotalAccountValue] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)

    useEffect(() => {
        if (data.length > 0) {
            const lastBalance = data[data.length - 1].balanceAfter
            const firstBalance = data[0].balanceBefore
            const profit = lastBalance - firstBalance

            setTotalAccountValue(lastBalance)
            setTotalProfit(profit)
        }
    }, [data])

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Trading Data Visualizer</h1>
                <UploadCSV setData={setData} />
            </header>
            {data.length > 0 ? (
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
                        </div>
                        <PersonalBests data={data} />
                    </section>
                    <section className="chart-section">
                        <div className="chart-section-container">
                            <Chart
                                data={data.map((d) => ({
                                    date: d.date,
                                    balance: d.balanceAfter,
                                }))}
                            />
                        </div>
                        <div className="pie-container">
                            <TradingPieChart data={data} />
                        </div>
                    </section>
                    <CustomCalendar data={data} />
                </main>
            ) : (
                <div className="no-data">
                    <p>Please upload a CSV file to see the chart.</p>
                </div>
            )}
        </div>
    )
}

export default App
