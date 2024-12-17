import React, { useEffect, useState } from 'react'
import { List, Tag, Typography, Divider } from 'antd'

const { Title } = Typography

interface ParsedRow {
    date: number // timestamp in ms
    balanceBefore: number
    balanceAfter: number
    realizedPnlValue: number
    realizedPnlCurrency: string
    token: string
    tpHit?: boolean
    slHit?: boolean
    panicClose?: boolean
    fomoEnter?: boolean
    followedRules?: boolean
}

interface JournalProps {
    trades: ParsedRow[]
}

const SavedTrades: React.FC<JournalProps> = ({ trades }) => {
    const [savedTrades, setSavedTrades] = useState<ParsedRow[]>([])

    useEffect(() => {
        console.log(trades)
    }, [savedTrades])

    const filteredTrades = trades.filter((trade) => trade.token).reverse()

    return (
        <div className="journal-container">
            <Title level={4}>Saved Trades</Title>
            <div className="scrollable-list">
                <List
                    dataSource={filteredTrades}
                    renderItem={(trade) => (
                        <List.Item className="trade-item">
                            <div style={{ flex: 1 }}>
                                <strong>Token: </strong>
                                {trade.token}
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>PnL: </strong>
                                <span
                                    style={{
                                        color:
                                            trade.realizedPnlValue >= 0
                                                ? 'green'
                                                : 'red',
                                    }}
                                >
                                    {trade.realizedPnlValue >= 0
                                        ? `+${trade.realizedPnlValue}`
                                        : trade.realizedPnlValue}
                                </span>
                            </div>
                            <div className="tag-grid">
                                {trade.tpHit === true && (
                                    <Tag color="green" className="fixed-tag">
                                        TP Hit
                                    </Tag>
                                )}
                                {trade.slHit === true && (
                                    <Tag color="red" className="fixed-tag">
                                        SL Hit
                                    </Tag>
                                )}
                                {trade.panicClose === true && (
                                    <Tag color="orange" className="fixed-tag">
                                        Panic Close
                                    </Tag>
                                )}
                                {trade.fomoEnter === true && (
                                    <Tag color="gold" className="fixed-tag">
                                        FOMO
                                    </Tag>
                                )}
                                {trade.followedRules === true && (
                                    <Tag color="green" className="fixed-tag">
                                        Strat Followed
                                    </Tag>
                                )}
                                {trade.followedRules === false && (
                                    <Tag color="red" className="fixed-tag">
                                        Broke Rules
                                    </Tag>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default SavedTrades
