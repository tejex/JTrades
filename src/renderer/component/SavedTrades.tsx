import React from 'react'
import { List, Tag, Typography } from 'antd'
import { JournalProps } from './interfaces'

const { Title } = Typography

const SavedTrades: React.FC<JournalProps> = ({ trades }) => {
    const filteredTrades = trades.filter((trade) => trade.token).reverse()

    return (
        <div className="saved-trades">
            <Title level={4}>Saved Trades</Title>
            <div className="scrollable-list">
                <List
                    dataSource={filteredTrades}
                    renderItem={(trade) => (
                        <List.Item className="trade-item">
                            <div style={{ flex: 1 }}>{trade.token}</div>
                            <div style={{ flex: 1 }}>
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
                                {trade.tpHit && (
                                    <Tag color="green" className="fixed-tag">
                                        TP
                                    </Tag>
                                )}
                                {trade.slHit && (
                                    <Tag color="red" className="fixed-tag">
                                        SL
                                    </Tag>
                                )}
                                {trade.panicClose && (
                                    <Tag color="orange" className="fixed-tag">
                                        Panic Close
                                    </Tag>
                                )}
                                {trade.fomoEnter && (
                                    <Tag color="gold" className="fixed-tag">
                                        FOMO
                                    </Tag>
                                )}
                                {trade.followedRules && (
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
