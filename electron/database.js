const path = require('path')
const Database = require('better-sqlite3')
const { app } = require('electron')

function initDatabase() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  // Choose filename based on environment
  const dbFileName = isDev ? 'todo_dev.db' : 'todo_prod.db'
  const dbPath = path.join(app.getAppPath(), dbFileName)
  const db = new Database(dbPath)

  // ONLY setup/seed data if in development mode
  if (isDev) {
    // Drop table to reset state cleanly on each dev launch if desired
    db.prepare(`drop table if exists todos;`).run()

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
  } else {
    // In production, ensure the table exists without dropping or forcing dev seed data
    db.prepare(`
      create table if not exists todos (
        id integer primary key autoincrement,
        text text not null,
        completed integer default 0,
        date text
      );
    `).run()
  }

  return db
}

module.exports = { initDatabase }