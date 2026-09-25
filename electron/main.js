const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { initDatabase } = require('./database')

// Initialize database based on environment
const db = initDatabase()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Completely remove the top menu bar
  Menu.setApplicationMenu(null)

  // In development, load the Vite local server URL. 
  // In production, load the built index.html file.
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

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

// IPC listener to set new todos in SQLite
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})