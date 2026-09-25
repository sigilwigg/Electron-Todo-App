import React, { useState, useEffect } from 'react'
import TodoListItem from './TodoListItem'

export default function TodoList({ selectedDate }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newText, setNewText] = useState('')
  
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
          })
        )
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

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (!newText.trim()) return

    try {
      console.log("adding todo");
      const newTodo = await window.api.addTodo({
        text: newText.trim(),
        date: selectedDate
      })
      setTodos([...todos, newTodo])
      setNewText('')
      setIsAdding(false)
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  // Filter out todos with dates later than today
  const visibleTodos = todos.filter(todo => todo.date == selectedDate)

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-medium text-base-content/75">Tasks for {selectedDate}</h3>
        {!isAdding && !isPastDay && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="btn btn-primary btn-xs rounded-full w-7 h-7 min-h-0 p-0 text-base"
            title="Add Task"
          >
            +
          </button>
        )}
      </div>

      {/* Inline New Item Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="flex gap-2 bg-base-100 p-3 rounded-box shadow-md">
          <input 
            type="text" 
            placeholder="Enter task description..." 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            autoFocus
            className="input input-bordered input-sm w-full"
          />
          <button type="submit" className="btn btn-primary btn-sm">Add</button>
          <button 
            type="button" 
            onClick={() => { setIsAdding(false); setNewText(''); }} 
            className="btn btn-ghost btn-sm"
          >
            Cancel
          </button>
        </form>
      )}

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