import React, { useState, useEffect } from 'react'
import TodoListItem from './TodoListItem'

export default function TodoList({ selectedDate }) {
    const [todos, setTodos] = useState([
        { id: 1, text: 'item 1', completed: false, date: '2026-09-20' },
        { id: 2, text: 'item 2', completed: true, date: '2026-09-20' },
        { id: 3, text: 'item 3', completed: false, date: '2026-09-24' },
        { id: 4, text: 'item 4', completed: false, date: '2026-09-25' },
    ])

    // Get today's date in YYYY-MM-DD format for comparison
    const todayStr = new Date().toISOString().split('T')[0]
    const isPastDay = selectedDate < todayStr

    // Automatically roll over uncompleted past tasks to today's date on load
    useEffect(() => {
        setTodos(prevTodos =>
        prevTodos.map(todo => {
            if (!todo.completed && todo.date < todayStr) {
            return { ...todo, date: todayStr }
            }
            return todo
        })
        )
    }, [todayStr])

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    // Filter out todos with dates later than today
    const visibleTodos = todos.filter(todo => todo.date == selectedDate)

    return (
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
    )
    }