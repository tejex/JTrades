import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Box } from '@mui/material'

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    action: string
}

interface TradingData {
    data: ParsedRow[]
}

const PersonalBests: React.FC<TradingData> = ({ data }) => {
    const [performance, setPerformance] = useState({ bestWin: 0, worstLoss: 0 })

    useEffect(() => {
        let prevBalance = 10000
        const newPerformance = { bestWin: 0, worstLoss: 0 }

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
            </div>
        </Box>
    )
}

export default PersonalBests
