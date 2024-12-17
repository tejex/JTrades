import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Box, Typography } from '@mui/material'

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    token: string
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

const PersonalBests: React.FC<TradingData> = ({
    data,
    accountSize,
    currentProfit,
}) => {
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

    return (
        <Box className="personal-bests-container">
            <h3>Total Account Value: ${accountSize.toFixed(2)}</h3>
            <h3>Total Profit / Loss: ${currentProfit.toFixed(2)}</h3>
            <div className="stats-grid">
                <Alert className="stat-box success-color">
                    <strong>Best Win:</strong> $
                    {Math.floor(performance.bestWin)}
                </Alert>
                <Alert className="stat-box error-color">
                    <strong>Biggest Loss:</strong> -$
                    {Math.floor(performance.worstLoss)}
                </Alert>
                <Alert className="stat-box info-color">
                    <strong>Portfolio Size:</strong> ${portfolioSize.toFixed(2)}
                </Alert>
                <Alert
                    className={`stat-box ${
                        profit >= 0 ? 'success-color' : 'error-color'
                    }`}
                >
                    <strong>Current Profit:</strong> $
                    {profit >= 0
                        ? `+${Math.floor(profit)}`
                        : `${Math.floor(profit)}`}
                </Alert>
            </div>
            <div className="wins-losses-container">
                <Typography className="wins">
                    Wins: {winsAndLosses.wins}
                </Typography>
                <Typography className="losses">
                    Losses: {winsAndLosses.losses}
                </Typography>
            </div>
        </Box>
    )
}

export default PersonalBests
