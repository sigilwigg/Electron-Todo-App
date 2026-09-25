const { ipcMain } = require('electron')

function registerTodoHandlers(db) {
  // IPC listener to fetch todos from SQLite
  ipcMain.handle('get-todos', () => {
    try {
      const stmt = db.prepare('select * from todos')
      return stmt.all()
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      return []
    }
  })

  // IPC listener to add a new todo in SQLite
  ipcMain.handle('add-todo', (event, { text, date }) => {
    try {
      const stmt = db.prepare('insert into todos (text, completed, date) values (?, 0, ?)')
      const info = stmt.run(text, date)
      return { id: info.lastInsertRowid, text, completed: 0, date }
    } catch (error) {
      console.error('Failed to add todo:', error)
      throw error
    }
  })

  // IPC listener to delete a todo from SQLite by id
  ipcMain.handle('delete-todo', (event, id) => {
    try {
      const stmt = db.prepare('delete from todos where id = ?')
      stmt.run(id)
      return true
    } catch (error) {
      console.error('Failed to delete todo:', error)
      throw error
    }
  })

  // IPC listener to update todo completion status
  ipcMain.handle('update-todo', (event, { id, completed }) => {
    try {
      const stmt = db.prepare('update todos set completed = ? where id = ?')
      stmt.run(completed ? 1 : 0, id)
      return true
    } catch (error) {
      console.error('Failed to update todo:', error)
      throw error
    }
  })
}

module.exports = { registerTodoHandlers }