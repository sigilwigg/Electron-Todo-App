import React, { useState } from 'react'
import DateSelector from './components/DateSelector'
import TodoList from './components/TodoList'

export default function App() {
  
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  return (
    <div className="p-8">
      <div className="">
        
        {/* Date Selector Component */}
        <DateSelector onDateChange={setSelectedDate} />

        <div className="divider"></div>

        {/* Todo List Component */}
        <TodoList selectedDate={selectedDate} />

      </div>
    </div>
  )
}