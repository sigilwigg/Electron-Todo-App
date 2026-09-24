import React, { useState } from 'react'
import TodoListItem from './TodoListItem'

export default function TodoList() {
  // Sample initial todo items
  const [todos, setTodos] = useState([
    { id: 1, text: 'item 1', completed: true },
    { id: 2, text: 'item 2', completed: true },
    { id: 3, text: 'item 3', completed: false },
  ])

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
  
        <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</div>
        
        {todos.map(todo => (
        <TodoListItem 
            key={todo.id} 
            task={todo.text} 
            completed={todo.completed} 
            onToggle={() => toggleTodo(todo.id)} 
        />
        ))}

    </ul>
  )
}