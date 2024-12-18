import React, { useState } from 'react'
import { Form, InputNumber, Button, Checkbox, Typography } from 'antd'
import { Flex } from 'antd'
import { TradeFormData, TradeFormProps } from './interfaces'

const { Title } = Typography

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

    const handleSymbolSelect = (symbol: string) => {
        setFormData((prev) => ({
            ...prev,
            symbol,
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
            time: formatDate(new Date()),
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
            const response = await window.electron.ipcRenderer.invoke(
                'add-new-trade',
                newTrade
            )
            if (response.success) onSubmit()
        } catch (error) {
            console.error('Error adding trade:', error)
        }

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
                    <Button.Group style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            type={
                                formData.symbol === 'BTC'
                                    ? 'primary'
                                    : 'default'
                            }
                            onClick={() => handleSymbolSelect('BTC')}
                        >
                            BTC
                        </Button>
                        <Button
                            type={
                                formData.symbol === 'ETH'
                                    ? 'primary'
                                    : 'default'
                            }
                            onClick={() => handleSymbolSelect('ETH')}
                        >
                            ETH
                        </Button>
                        <Button
                            type={
                                formData.symbol === 'SOL'
                                    ? 'primary'
                                    : 'default'
                            }
                            onClick={() => handleSymbolSelect('SOL')}
                        >
                            SOL
                        </Button>
                    </Button.Group>
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
                    <Flex justify="space-between" style={{ flexWrap: 'wrap' }}>
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
                        <Checkbox
                            checked={formData.followedRules}
                            onChange={handleCheckboxChange('followedRules')}
                        >
                            Followed Rules
                        </Checkbox>
                    </Flex>
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
