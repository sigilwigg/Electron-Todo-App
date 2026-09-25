const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (todo) => ipcRenderer.invoke('add-todo', todo),
  deleteTodo: (id) => ipcRenderer.invoke('delete-todo', id),
  updateTodo: (todo) => ipcRenderer.invoke('update-todo', todo),
})