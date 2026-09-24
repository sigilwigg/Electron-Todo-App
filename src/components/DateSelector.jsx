import React, { useState } from 'react'

export default function DateSelector({ onDateChange }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Move back one day
  const handlePrevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
    updateParent(newDate)
  }

  // Move forward one day
  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
    updateParent(newDate)
  }

  // Helper to push the YYYY-MM-DD string up to App/TodoList
  const updateParent = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    if (onDateChange) {
      onDateChange(dateStr)
    }
  }

  // Format date nicely for display
  const formattedDateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-base-content font-heading">Todo</h1>
        <p className="text-sm text-base-content/60 mt-1">{formattedDateString}</p>
      </div>
      
      <div className="flex gap-1 bg-base-100 p-1 rounded-lg border border-base-300 shadow-sm">
        <button 
          onClick={handlePrevDay} 
          className="btn btn-sm btn-ghost btn-square"
          title="Previous Day"
        >
          ◀
        </button>
        <button 
          onClick={handleNextDay} 
          className="btn btn-sm btn-ghost btn-square"
          title="Next Day"
        >
          ▶
        </button>
      </div>
    </div>
  )
}