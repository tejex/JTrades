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
    onSubmit: (formData: TradeFormData) => void
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

    const handleSubmit = () => {
        onSubmit(formData)
        setFormData({
            symbol: '',
            followedRules: false,
            pnlValue: 0,
            tpHit: false,
            slHit: false,
            panicClose: false,
            fomoEnter: false,
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
                Enter Honestly if you wish to grow : ){' '}
            </p>
            <Form layout="vertical" onFinish={handleSubmit}>
                {/* Symbol */}
                <Form.Item label="Symbol Traded">
                    <Input
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="e.g., BTC, ETH, SOL"
                    />
                </Form.Item>

                {/* PnL Value */}
                <Form.Item label="PnL Value">
                    <InputNumber
                        value={formData.pnlValue}
                        onChange={handlePnLChange}
                        placeholder="e.g., -50, 200"
                        step={0.01}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* Checkboxes */}
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

                {/* Submit Button */}
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
