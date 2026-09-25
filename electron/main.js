const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const Database = require('better-sqlite3')

// Initialize SQLite database (saves a file named 'todos.db' in your project root or app data folder)
const dbPath = path.join(app.getAppPath(), 'todos.db')
const db = new Database(dbPath)

// Create table and insert a few sample rows if it's empty
db.prepare(`
  drop table if exists todos;
`).run();

db.prepare(`
  create table if not exists todos (
    id integer primary key autoincrement,
    text text not null,
    completed integer default 0,
    date text
  );
`).run()

const rowCount = db.prepare('select count(*) as count from todos').get().count
if (rowCount === 0) {
  const insert = db.prepare('insert into todos (text, completed, date) values (?, ?, ?)')
  insert.run('item 1', 1, '2026-09-24')
  insert.run('item 2', 0, '2026-09-25')
  insert.run('item 3', 0, '2026-09-25')
}

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
    mainWindow.loadFile(path.join(__brname, '../dist/index.html'))
  }
}

// IPC listener to fetch todos from SQLite
ipcMain.handle('get-todos', () => {
  try {
    const stmt = db.prepare('select * from todos')
    console.log(stmt.all()[0]);
    return stmt.all()
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return []
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