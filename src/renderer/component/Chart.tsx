import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart'
import { TradeBalance } from './interfaces'

const Chart = ({ data }: { data: TradeBalance[] }) => {
    const xDataIndex = data.map((_, index) => index * 10)
    const yData = data.map((item) => item.balance)
    const xLabels = data.map((item) => item.date)

    return (
        <div
            className="chart-container"
            style={{ height: '435px', width: '100%' }} // Ensure the container has height and width
        >
            <LineChart
                series={[
                    {
                        data: yData,
                        label: 'Balance Over Time',
                        showMark: ({ index }) => index % 8 === 0,
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
