import React from 'react'

export default function TodoListItem({ task, completed, isDisabled, onToggle }) {
  return (
    <li className="list-row">
        <input 
            type="checkbox" 
            checked={completed} 
            disabled={isDisabled}
            onChange={onToggle}
            className="checkbox checkbox-primary" 
        />
        <div>
            {task}
        </div>
    </li>
  )
}