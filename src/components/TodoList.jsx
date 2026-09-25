import React, { useState } from 'react'
import TodoListItem from './TodoListItem'
import FormAddTodoItem from './FormAddTodoItem'
import { useTodos } from '../hooks/useTodos'

export default function TodoList({ selectedDate }) {
  const { todos, loading, addTodo, toggleTodo, todayStr } = useTodos()
  const [isAdding, setIsAdding] = useState(false)

  const isPastDay = selectedDate < todayStr
  const visibleTodos = todos.filter(todo => todo.date === selectedDate)

  const handleAdd = async (text) => {
    await addTodo(text, selectedDate)
    setIsAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
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

      {/* Conditional Add Form */}
      {isAdding && (
        <FormAddTodoItem 
          onAdd={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      )}

      {/* Loading or Task List */}
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