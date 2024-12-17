import React, { useState } from 'react'
import { Form, Input, InputNumber, Button, Checkbox, Typography } from 'antd'

const { Title } = Typography

interface TradeFormData {
    symbol: string
    followedRules: boolean
    pnlValue: number
    tpHit: boolean
    slHit: boolean
    panicClose: boolean
    fomoEnter: boolean
}

interface TradeFormProps {
    totalAccountValue: number
    onSubmit: () => void // Updated to match expected functionality
}

const Journal: React.FC<TradeFormProps> = ({ totalAccountValue, onSubmit }) => {
    const [formData, setFormData] = useState<TradeFormData>({
        symbol: '',
        followedRules: false,
        pnlValue: 0,
        tpHit: false,
        slHit: false,
        panicClose: false,
        fomoEnter: false,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePnLChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            pnlValue: value || 0,
        }))
    }

    const handleCheckboxChange = (name: keyof TradeFormData) => (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.checked,
        }))
    }

    const handleSubmit = async () => {
        const formatDate = (date: Date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        const newTrade = {
            time: formatDate(new Date()), // Format date correctly
            balance_before: totalAccountValue,
            balance_after: totalAccountValue + formData.pnlValue,
            realized_pnl: formData.pnlValue,
            currency: 'USD',
            token: formData.symbol,
            tpHit: formData.tpHit,
            slHit: formData.slHit,
            panicClose: formData.panicClose,
            fomoEnter: formData.fomoEnter,
            followedRules: formData.followedRules,
        }

        try {
            // Call Electron API to add new trade
            const response = await window.electron.ipcRenderer.invoke(
                'add-new-trade',
                newTrade
            )

            if (response.success) {
                onSubmit() // Reload trade data
            } else {
                console.error('Failed to add trade:', response.message)
            }
        } catch (error) {
            console.error('Error adding trade:', error)
        }

        // Reset form
        setFormData({
            symbol: '',
            pnlValue: 0,
            tpHit: false,
            slHit: false,
            panicClose: false,
            fomoEnter: false,
            followedRules: false,
        })
    }

    return (
        <div className="journal-container">
            <Title
                level={4}
                style={{ textAlign: 'center', marginBottom: '10px' }}
            >
                Log Your Trade
            </Title>
            <p style={{ textAlign: 'center', marginBottom: '10px' }}>
                Enter Honestly if you wish to grow :)
            </p>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Symbol Traded" required>
                    <Input
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="e.g., BTC, ETH, SOL"
                    />
                </Form.Item>
                <Form.Item label="PnL Value" required>
                    <InputNumber
                        value={formData.pnlValue}
                        onChange={handlePnLChange}
                        placeholder="e.g., -50, 200"
                        step={0.01}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item label="Flags">
                    <Checkbox
                        checked={formData.followedRules}
                        onChange={handleCheckboxChange('followedRules')}
                    >
                        Followed Rules
                    </Checkbox>
                    <Checkbox
                        checked={formData.tpHit}
                        onChange={handleCheckboxChange('tpHit')}
                    >
                        TP Hit
                    </Checkbox>
                    <Checkbox
                        checked={formData.slHit}
                        onChange={handleCheckboxChange('slHit')}
                    >
                        SL Hit
                    </Checkbox>
                    <Checkbox
                        checked={formData.panicClose}
                        onChange={handleCheckboxChange('panicClose')}
                    >
                        Panic Close
                    </Checkbox>
                    <Checkbox
                        checked={formData.fomoEnter}
                        onChange={handleCheckboxChange('fomoEnter')}
                    >
                        FOMO Enter
                    </Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%' }}
                    >
                        Log Trade
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Journal
