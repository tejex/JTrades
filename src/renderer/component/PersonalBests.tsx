import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { ParsedRow, TradingData, WinsAndLosses } from './interfaces'

const PersonalBests: React.FC<TradingData> = ({ data }) => {
    const [performance, setPerformance] = useState({
        bestWin: 0,
        worstLoss: 0,
    })
    const [winsAndLosses, setWinsAndLosses] = useState<WinsAndLosses>({
        wins: 0,
        losses: 0,
    })
    const [portfolioSize, setPortfolioSize] = useState(0)
    const [profit, setProfit] = useState(0)

    useEffect(() => {
        let prevBalance = 10000
        const newPerformance = { bestWin: 0, worstLoss: 0 }

        if (data.length > 1) {
            const result = data.reduce(
                (acc: WinsAndLosses, curr: ParsedRow, index: number) => {
                    if (index === 0) return acc // Skip the starting balance row

                    const prevBalance = data[index - 1].balanceAfter
                    const currBalance = curr.balanceAfter

                    if (currBalance - prevBalance > 5) acc.wins += 1
                    if (prevBalance - currBalance > 5) acc.losses += 1

                    return acc
                },
                { wins: 0, losses: 0 }
            )

            setWinsAndLosses(result)
        }

        data.forEach((trade) => {
            if (trade.balanceAfter > prevBalance) {
                newPerformance.bestWin = Math.max(
                    trade.balanceAfter - prevBalance,
                    newPerformance.bestWin
                )
            } else if (trade.balanceAfter < prevBalance) {
                newPerformance.worstLoss = Math.max(
                    prevBalance - trade.balanceAfter,
                    newPerformance.worstLoss
                )
            }
            prevBalance = trade.balanceAfter
        })

        setPerformance(newPerformance)
        setPortfolioSize(data[data.length - 1]?.balanceAfter || 0)
        setProfit(data[data.length - 1]?.balanceAfter - 10000 || 0)
    }, [data])

    const calculatePercentage = (value: number, base: number) =>
        ((value / base) * 100).toFixed(2)

    const profitClass = profit >= 0 ? 'positive-profit' : 'negative-profit'
    return (
        <div className="dashboard">
            <div className="total-portfolio">
                <h1>Current Account:</h1>
                <Typography.Title level={1}>
                    ${portfolioSize.toFixed(2)}
                </Typography.Title>
                <div className={`profit-container ${profitClass}`}>
                    <Typography.Text>
                        {profit >= 0 ? '+' : ''}${Math.floor(profit)} (
                        {calculatePercentage(profit, 10000)}%)
                    </Typography.Text>
                </div>
            </div>
            <div className="best-worst">
                <p className="bestWin">
                    Best Win: ${Math.floor(performance.bestWin)}
                </p>
                <p className="worstLoss">
                    Worst Loss: -${Math.floor(performance.worstLoss)}
                </p>
            </div>
            <div className="wins-losses">
                <div className="wins">
                    <p>Wins: {winsAndLosses.wins}</p>
                </div>
                <div className="losses">
                    <p>Losses: {winsAndLosses.losses}</p>
                </div>
            </div>
        </div>
    )
}

export default PersonalBests
