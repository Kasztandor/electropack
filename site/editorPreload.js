const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: () => {
        console.log(title)
        ipcRenderer.send('channel')
    }
})