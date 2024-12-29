import React, { useState } from 'react'
import { ParsedRow, CalendarProps } from './interfaces'

const groupPnLByDate = (data: ParsedRow[]) => {
    return data.reduce(
        (acc, trade) => {
            const dateKey = new Date(trade.date).toISOString().split('T')[0]
            acc[dateKey] = (acc[dateKey] || 0) + trade.realizedPnlValue
            return acc
        },
        {} as Record<string, number>
    )
}

const calculateMonthlyPnL = (
    groupedPnL: Record<string, number>,
    year: number,
    month: number
) => {
    return Object.entries(groupedPnL).reduce((total, [date, pnl]) => {
        const dateObj = new Date(date)
        if (dateObj.getFullYear() === year && dateObj.getMonth() === month) {
            total += pnl
        }
        return total
    }, 0)
}

const CustomCalendar: React.FC<CalendarProps> = ({ data }) => {
    const groupedPnL = groupPnLByDate(data)

    const dates = data.map((trade) => new Date(trade.date))
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    const [currentMonth, setCurrentMonth] = useState(minDate)

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        )
    }

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        )
    }

    const isNextDisabled =
        currentMonth.getFullYear() === maxDate.getFullYear() &&
        currentMonth.getMonth() === maxDate.getMonth()

    const isPrevDisabled =
        currentMonth.getFullYear() === minDate.getFullYear() &&
        currentMonth.getMonth() === minDate.getMonth()

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const monthlyPnL = calculateMonthlyPnL(groupedPnL, year, month)

    // Initialize weekly profit
    let weeklyPnL = 0
    let dayOfWeekCounter = 0

    return (
        <div className="calendar-component">
            <h1>Monthly Progress Chart</h1>
            <div className="calendar-navigation">
                <button onClick={prevMonth} disabled={isPrevDisabled}>
                    Previous
                </button>
                <h2>
                    {currentMonth.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h2>
                <button onClick={nextMonth} disabled={isNextDisabled}>
                    Next
                </button>
            </div>

            <div
                className={`monthly-pnl ${monthlyPnL >= 0 ? 'positive' : 'negative'}`}
            >
                Total PnL for{' '}
                {currentMonth.toLocaleString('default', { month: 'long' })}: $
                {monthlyPnL.toFixed(2)}
            </div>

            <div className="calendar-grid">
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const pnl = groupedPnL[dateKey] || 0
                    weeklyPnL += pnl
                    dayOfWeekCounter++

                    const isEndOfWeek =
                        dayOfWeekCounter === 7 || day === daysInMonth
                    const dayElement = (
                        <div
                            className="calendar-day"
                            key={dateKey}
                            style={{
                                backgroundColor:
                                    pnl === 0
                                        ? '#f4f4f4'
                                        : pnl > 0
                                          ? '#d4edda'
                                          : '#f8d7da',
                                color:
                                    pnl > 0
                                        ? '#155724'
                                        : pnl < 0
                                          ? '#721c24'
                                          : '#6c757d',
                            }}
                        >
                            <div className="day-number">{day}</div>
                            {pnl !== 0 && (
                                <div className="pnl-value">
                                    ${pnl.toFixed(2)}
                                </div>
                            )}
                        </div>
                    )

                    if (isEndOfWeek) {
                        const weeklyElement = (
                            <div
                                className="calendar-day weekly-total"
                                key={`week-total-${i}`}
                                style={{
                                    backgroundColor:
                                        weeklyPnL === 0
                                            ? '#f4f4f4'
                                            : weeklyPnL > 0
                                              ? '#d4edda'
                                              : '#f8d7da',
                                    color:
                                        weeklyPnL > 0
                                            ? '#155724'
                                            : weeklyPnL < 0
                                              ? '#721c24'
                                              : '#6c757d',
                                }}
                            >
                                <div className="pnl-value">
                                    Week Total: ${weeklyPnL.toFixed(2)}
                                </div>
                            </div>
                        )
                        weeklyPnL = 0
                        dayOfWeekCounter = 0
                        return [dayElement, weeklyElement]
                    }

                    return dayElement
                }).flat()}
            </div>
        </div>
    )
}

export default CustomCalendar
