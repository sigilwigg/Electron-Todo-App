import React from 'react'

export default function TodoListItem({ task, completed, isDisabled, onToggle, onDelete }) {
  return (
    <li className="group flex items-center justify-between p-3 bg-base-100 hover:bg-base-200/50 rounded-box transition-colors">
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={completed} 
          onChange={onToggle}
          disabled={isDisabled}
          className="checkbox checkbox-primary checkbox-sm" 
        />
        <span className={`text-sm ${completed ? 'text-base-content/60' : ''}`}>
          {task}
        </span>
      </div>

      {/* Delete button appears on hover, hidden on past days */}
      {!isDisabled && (
        <button
          type="button"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity btn btn-error btn-xs text-white rounded-full w-6 h-6 min-h-0 p-0"
          title="Delete task"
        >
          ✕
        </button>
      )}
    </li>
  )
}