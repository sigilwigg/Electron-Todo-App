import { useState, useEffect } from 'react'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    window.api.getTodos()
      .then((data) => {
        setTodos(
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

  const addTodo = async (text, date) => {
    try {
      const newTodo = await window.api.addTodo({ text, date })
      setTodos((prev) => [...prev, newTodo])
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find(t => t.id === id)
    if (!todoToToggle) return

    const newCompleted = !todoToToggle.completed

    try {
      // Update database via IPC
      await window.api.updateTodo({ id, completed: newCompleted ? 1 : 0 })
      
      // Update local state
      setTodos((prev) =>
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: newCompleted ? 1 : 0 } : todo
        )
      )
    } catch (err) {
      console.error('Error updating todo status:', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await window.api.deleteTodo(id)
      setTodos((prev) => prev.filter(todo => todo.id !== id))
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo, todayStr }
}