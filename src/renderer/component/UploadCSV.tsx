import React, { Dispatch, SetStateAction } from 'react'
import Papa from 'papaparse'

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    action: string
}

interface UploadCSVProps {
    setData: Dispatch<SetStateAction<ParsedRow[]>>
}

const parseCSV = (file: File): Promise<ParsedRow[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[]
                const parsedData: ParsedRow[] = []

                for (const row of data) {
                    const dateString = row['Time']?.trim()
                    if (!dateString) {
                        console.error('Missing date string in row:', row)
                        continue
                    }

                    const isoDateString = dateString.replace(' ', 'T') + 'Z'
                    const date = new Date(isoDateString)

                    if (isNaN(date.getTime())) {
                        console.error(
                            'Invalid Date:',
                            isoDateString,
                            'Original:',
                            dateString
                        )
                        continue
                    }

                    const balanceBefore = parseFloat(row['Balance Before'])
                    const balanceAfter = parseFloat(row['Balance After'])
                    const realizedPnlValue = parseFloat(
                        row['Realized P&L (value)']
                    )
                    const realizedPnlCurrency =
                        row['Realized P&L (currency)']?.trim() || ''
                    const action = row['Action']?.trim() || ''

                    if (
                        isNaN(balanceBefore) ||
                        isNaN(balanceAfter) ||
                        isNaN(realizedPnlValue)
                    ) {
                        console.error('Invalid numeric fields in row:', row)
                        continue
                    }

                    parsedData.push({
                        date: date.getTime(), // Ensure unique timestamp
                        balanceBefore,
                        balanceAfter,
                        realizedPnlValue,
                        realizedPnlCurrency,
                        action,
                    })
                }

                parsedData.sort((a, b) => a.date - b.date)

                if (parsedData.length > 0) {
                    const initialDate = parsedData[0].date - 1
                    parsedData.unshift({
                        date: initialDate,
                        balanceBefore: 10000,
                        balanceAfter: 10000,
                        realizedPnlValue: 0,
                        realizedPnlCurrency: 'USD',
                        action: 'Starting Balance',
                    })
                }
                console.log(parsedData)
                resolve(parsedData)
            },
            error: (error) => {
                reject(error)
            },
        })
    })
}

const UploadCSV: React.FC<UploadCSVProps> = ({ setData }) => {
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            try {
                const parsedData = await parseCSV(file)
                setData(parsedData)
                console.log(parsedData)
            } catch (error) {
                console.error('Error parsing CSV:', error)
            }
        }
    }

    return <input type="file" accept=".csv" onChange={handleFileUpload} />
}

export default UploadCSV
