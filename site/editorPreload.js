const { contextBridge, ipcRenderer } = require('electron')
const fs = require('node:fs')

contextBridge.exposeInMainWorld('electropackAPI', {
    devtools: () => {
        ipcRenderer.send('devtools')
    },
    loadConfig: (dir) => {
        ipcRenderer.send('loadconfig', dir)
        if (!fs.existsSync(dir+"/.electropack.json")){
            fs.writeFileSync(dir+"/.electropack.json", JSON.stringify({}, null, 4))
        }
        let config = fs.readFileSync(dir+"/.electropack.json", "utf-8")
        return JSON.parse(config)
    },
    setConfig: (dir, config) => {},
    readDir: (dir) => {
        ipcRenderer.send('readfiles', dir)
        let files = fs.readdirSync(dir)
        return files
    }
})