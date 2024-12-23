import { useEffect, useState } from 'react'
import { Form, InputNumber, Button, Checkbox, Typography } from 'antd'

const DailyGoal: React.FC = () => {
    const [dailyGoal, setGoal] = useState(100)

    const handleGoalChange = (value: any) => {
        setGoal(value)
    }

    return (
        <div>
            <h1>Daily Goal: ${dailyGoal + ''}</h1>
            <Form layout="vertical">
                <Form.Item>
                    <InputNumber
                        onChange={handleGoalChange}
                        placeholder="e.g., -50, 200"
                        step={0.01}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default DailyGoal
