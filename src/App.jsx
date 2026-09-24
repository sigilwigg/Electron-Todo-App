import React from 'react'
import TodoList from './components/TodoList'

export default function App() {
  // Format the current date nicely (e.g., "Thursday, September 24, 2026")
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="p-8">
      <div className="">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-base-content font-title">Todo</h1>
          <p className="text-sm text-base-content/60 mt-1">{currentDate}</p>
        </div>

        <div className="divider"></div>

        {/* Placeholder Box for the List */}
        <TodoList />

      </div>
    </div>
  )
}