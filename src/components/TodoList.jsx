import React, { useState, useEffect } from 'react'
import TodoListItem from './TodoListItem'

export default function TodoList({ selectedDate }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Get today's date in YYYY-MM-DD format for comparison
  const todayStr = new Date().toISOString().split('T')[0]
  const isPastDay = selectedDate < todayStr

  useEffect(() => {
    // Fetch todos from the SQLite database via the Electron IPC bridge
    window.api.getTodos()
      .then((data) => {
        setTodos(
          // Automatically roll over uncompleted past tasks to today's date on load
          data.map(todo => {
              if (!todo.completed && todo.date < todayStr) {
              return { ...todo, date: todayStr }
              }
              return todo
          }))
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading todos:', err)
        setLoading(false)
      })
  }, [todayStr])

  const toggleTodo = (id) => {
      setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
  }

  // Filter out todos with dates later than today
  const visibleTodos = todos.filter(todo => todo.date == selectedDate)

  return (
    <div>
      {loading ? (
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-md">
            
          {visibleTodos.length === 0 ? (
            <p className="text-center text-base-content/40 italic py-8">No tasks scheduled for this day.</p>
          ) : (
            visibleTodos.map(todo => (
              <TodoListItem 
                key={todo.id} 
                task={todo.text} 
                completed={todo.completed}
                isDisabled={isPastDay}
                onToggle={() => toggleTodo(todo.id)} 
              />
            ))
          )}
        </ul>
      )}
    </div>
  )
}