import React, { useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    action: string
}

interface WinsAndLosses {
    wins: number
    losses: number
}

const TradingPieChart = ({ data }: { data: ParsedRow[] }) => {
    const [winsAndLosses, setWinsAndLosses] = useState<WinsAndLosses>({
        wins: 0,
        losses: 0,
    })

    useEffect(() => {
        // Calculate wins and losses only once when the component loads
        if (data.length > 1) {
            const result = data.reduce(
                (
                    acc: WinsAndLosses,
                    curr: ParsedRow,
                    index: number,
                    array: ParsedRow[]
                ) => {
                    if (index === 0) return acc // Skip the starting balance row

                    const prevBalance = array[index - 1].balanceAfter
                    const currBalance = curr.balanceAfter

                    if (currBalance - prevBalance > 5) {
                        acc.wins += 1
                    } else if (prevBalance - currBalance > 5) {
                        acc.losses += 1
                    }

                    return acc
                },
                { wins: 0, losses: 0 }
            )

            setWinsAndLosses(result)
        }
    }, [data])

    // Prepare data for PieChart
    const chartData = [
        { id: 0, value: winsAndLosses.wins, label: 'Wins' },
        { id: 1, value: winsAndLosses.losses, label: 'Losses' },
    ]

    return (
        <div className="piechart-container">
            <PieChart
                series={[
                    {
                        data: chartData,
                    },
                ]}
                width={360}
                height={400}
            />
            <div className="piechart-stats">
                <p>Wins: {winsAndLosses.wins}</p>
                <p>Losses: {winsAndLosses.losses}</p>
            </div>
        </div>
    )
}

export default TradingPieChart
