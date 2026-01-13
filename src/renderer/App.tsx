import React, { useEffect, useState } from 'react'
import CustomCalendar from './component/Calendar'

interface TradovateData {
    accountId: string;
    accountName: string;
    date: string;
    totalAmount: number;
    dailyPnL: number;
}

function App() {
    const [trades, setTrades] = useState<TradovateData[]>([]);

    const fetchTrades = async () => {
            try {
                const data: TradovateData[] = await window.electron.ipcRenderer.invoke('read-tradovate-csv');
                setTrades(data);

                if (data.length > 0) {
                    const currentBalance = data[data.length - 1].totalAmount;
                    const totalProfit = data.reduce((sum, row) => sum + row.dailyPnL, 0);

                    console.log(`Balance: ${currentBalance}, Total PnL: ${totalProfit}`);
                }
            } catch (err) {
                console.error('Failed to load Tradovate data:', err);
            }
        };

    useEffect(() => {
        fetchTrades()
    }, [trades])

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 style={{ marginTop: '5%' }}>Futures Trading Statistics</h1>
            </header>
            {trades.length > 0 ? (
                <main className="app-main">
                    <section className="info-section">
                        <div className="calendar-container">
                            <CustomCalendar data={trades} />
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
