const { contextBridge, ipcRenderer } = require('electron')
const fs = require('node:fs')

contextBridge.exposeInMainWorld('electropackAPI', {
    devtools: () => {
        ipcRenderer.send('devtools')
    },
    loadConfig: (dir) => {
        if (!fs.existsSync(dir+"/.electropack.json")){
            const cfg = {
                oppenedDirs: []
            }
            fs.writeFileSync(dir+"/.electropack.json", JSON.stringify(cfg, null, 4))
            return cfg
        }
        let cfg = fs.readFileSync(dir+"/.electropack.json", "utf-8")
        return JSON.parse(cfg)
    },
    setConfig: (dir, cfg) => {
        fs.writeFileSync(dir+"/.electropack.json", JSON.stringify(cfg, null, 4))
    },
    readDir: (dir) => {
        ipcRenderer.send('readfiles', dir)
        let files = fs.readdirSync(dir)
        return files
    }
})