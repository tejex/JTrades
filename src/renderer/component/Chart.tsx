import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart'
import { TradeBalance } from './interfaces'

const Chart = ({ data }: { data: TradeBalance[] }) => {
    // Get the last 10 trades
    const recentData = data.slice(-25)

    // Prepare data for the chart
    const xDataIndex = recentData.map((_, index) => index * 10)
    const yData = recentData.map((item) => item.balance)
    const xLabels = recentData.map((item) => item.date)

    return (
        <div
            className="chart-container"
            style={{ height: '435px', width: '80%' }} // Ensure the container has height and width
        >
            <h1>Last 20 Trades:</h1>
            <LineChart
                sx={{ color: 'white' }}
                series={[
                    {
                        data: yData,
                        label: 'Balance Over Time',
                        showMark: ({ index }) => index % 1 === 0,
                        color: 'blue',
                    },
                ]}
                xAxis={[
                    {
                        scaleType: 'linear',
                        data: xDataIndex,
                        label: 'Date',
                        valueFormatter: (value) => {
                            const index = xDataIndex.indexOf(value)
                            return index !== -1
                                ? new Date(xLabels[index]).toLocaleDateString()
                                : ''
                        },
                    },
                ]}
                yAxis={[{}]}
            />
        </div>
    )
}

export default Chart
