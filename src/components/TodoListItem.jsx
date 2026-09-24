import React from 'react'

export default function TodoListItem({ task, completed, onToggle }) {
  return (
    <li className="list-row">
        <input 
            type="checkbox" 
            checked={completed} 
            onChange={onToggle}
            className="checkbox checkbox-primary" 
        />
        <div>
            {task}
        </div>
    </li>
  )
}