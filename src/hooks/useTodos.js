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

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return { todos, loading, addTodo, toggleTodo, todayStr }
}