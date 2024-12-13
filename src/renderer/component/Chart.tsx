import { LineChart } from '@mui/x-charts/LineChart'

interface TradeBalance {
    date: number // Timestamp of the trade
    balance: number // Account balance after the trade
}

const Chart = ({ data }: { data: TradeBalance[] }) => {
    const xDataIndex = data.map((_, index) => index * 10)
    const yData = data.map((item) => item.balance)
    const xLabels = data.map((item) => item.date)

    return (
        <div className="chart-container">
            <LineChart
                series={[
                    {
                        data: yData,
                        label: 'Balance Over Time',
                        showMark: ({ index }) => index % 4 === 0,
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
