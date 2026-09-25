import React, { useState } from 'react'

export default function FormAddTodoItem({ onAdd, onCancel }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 bg-base-100 p-3 rounded-box shadow-md">
      <input 
        type="text" 
        placeholder="Enter task description..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        className="input input-bordered input-sm w-full"
      />
      <button type="submit" className="btn btn-primary btn-sm">Add</button>
      <button 
        type="button" 
        onClick={onCancel} 
        className="btn btn-ghost btn-sm"
      >
        Cancel
      </button>
    </form>
  )
}