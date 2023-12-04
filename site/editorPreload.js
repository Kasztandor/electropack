const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: () => {
        ipcRenderer.send('channel', 'test')
    }
})