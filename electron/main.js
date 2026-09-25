const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { initDatabase } = require('./database')
const { registerTodoHandlers } = require('./ipcHandlers/todos');

// Initialize database and register IPC handlers
const db = initDatabase()
registerTodoHandlers(db)

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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})