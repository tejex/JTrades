import React, { useState } from 'react'

interface TradovateData {
    accountId: string;
    accountName: string;
    date: string;
    totalAmount: number;
    dailyPnL: number;
}

// Updated to use TradovateData fields
const groupPnLByDate = (data: TradovateData[]) => {
    return data.reduce(
        (acc, trade) => {
            // Tradovate dates are typically "YYYY-MM-DD", but we ensure consistency here
            const dateKey = trade.date.trim();
            acc[dateKey] = (acc[dateKey] || 0) + trade.dailyPnL;
            return acc;
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
        // Adjust for UTC if your CSV dates are strictly YYYY-MM-DD to avoid offset issues
        if (dateObj.getUTCFullYear() === year && dateObj.getUTCMonth() === month) {
            total += pnl
        }
        return total
    }, 0)
}

const CustomCalendar: React.FC<{ data: TradovateData[] }> = ({ data }) => {
    const groupedPnL = groupPnLByDate(data)

    const timestamps = data.map((d) => new Date(d.date).getTime());
    const maxDate = new Date(Math.max(...timestamps))

    const [currentMonth, setCurrentMonth] = useState(
        new Date(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), 1)
    );

    const year = currentMonth.getUTCFullYear()
    const month = currentMonth.getUTCMonth()

    // 1. Calculate how many days are in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // 2. Calculate the day of the week the 1st falls on (0 = Sunday, 1 = Monday...)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))
    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))

    const monthlyPnL = calculateMonthlyPnL(groupedPnL, year, month)

    // Prepare all cells (Padding + Days)
    const calendarCells = []

    // Add empty padding cells for days before the 1st
    for (let p = 0; p < firstDayOfMonth; p++) {
        calendarCells.push(<div key={`pad-${p}`} className="calendar-day empty" />);
    }

    // Add actual days
    let weeklyPnL = 0
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const pnl = groupedPnL[dateKey] || 0
        weeklyPnL += pnl

        calendarCells.push(
          <div key={dateKey} className="calendar-day" style={{
              backgroundColor: pnl > 0 ? '#065f46' : pnl < 0 ? '#7f1d1d' : '#1b263b'
          }}>
              <span className="day-number">{day}</span>
              {pnl !== 0 && <span className="pnl-value">${pnl.toFixed(2)}</span>}
          </div>
        )

        const dayOfWeek = (firstDayOfMonth + day - 1) % 7;

        if (dayOfWeek === 6 || day === daysInMonth) {
            const weeklyClass = weeklyPnL > 0 ? 'positive' : weeklyPnL < 0 ? 'negative' : '';
            calendarCells.push(
                <div key={`week-${day}`} className={`calendar-day weekly-total ${weeklyClass}`}>
                    <strong>Week: ${weeklyPnL.toFixed(2)}</strong>
                </div>
            );
            weeklyPnL = 0
        }
    }

    return (
        <div className="calendar-component">
            <div className="calendar-navigation">
                <button onClick={prevMonth}>Previous</button>
                <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={nextMonth}>Next</button>
            </div>

            <div className={`monthly-pnl ${monthlyPnL >= 0 ? 'positive' : 'negative'}`}>
                Monthly Result: ${monthlyPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>

            {/* Header for Day Names */}
            <div className="calendar-grid-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Weekly'].map(d => (
                    <div key={d} className="header-name">{d}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {calendarCells}
            </div>
        </div>
    )
}

export default CustomCalendar
