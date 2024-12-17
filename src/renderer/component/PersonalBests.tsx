import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Box } from '@mui/material'

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
}

interface WinsAndLosses {
    wins: number
    losses: number
}

const PersonalBests: React.FC<TradingData> = ({ data }) => {
    const [performance, setPerformance] = useState({ bestWin: 0, worstLoss: 0 })
    const [winsAndLosses, setWinsAndLosses] = useState<WinsAndLosses>({
        wins: 0,
        losses: 0,
    })

    useEffect(() => {
        let prevBalance = 10000
        const newPerformance = { bestWin: 0, worstLoss: 0 }

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

            setPerformance(newPerformance)
        })
    }, [])

    return (
        <Box>
            <div className="performance-box">
                <Alert severity="success">
                    Best Win: ${Math.floor(performance.bestWin)}
                </Alert>
                <Alert severity="error">
                    Biggest Loss: -${Math.floor(performance.worstLoss)}
                </Alert>
                <div className="winsAndLosses">
                    <p>Wins: {winsAndLosses.wins}</p>
                    <p>Losses: {winsAndLosses.losses}</p>
                </div>
            </div>
        </Box>
    )
}

export default PersonalBests
