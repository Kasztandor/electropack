const { contextBridge, ipcRenderer } = require('electron')
const fs = require('node:fs')
const path = require('node:path')
let dir = "/home/kasztandor/Pulpit/testdir"

contextBridge.exposeInMainWorld('electropackAPI', {
    setDir: (newDir) => {
        dir = newDir
    },
    devtools: () => {
        ipcRenderer.send('devtools')
    },
    loadConfig: () => {
        let confFile = path.join(dir,".electropack.json")
        if (!fs.existsSync(confFile)){
            const cfg = {
                oppenedDirs: []
            }
            fs.writeFileSync(confFile, JSON.stringify(cfg, null, 4))
            return cfg
        }
        let cfg = fs.readFileSync(confFile, "utf-8")
        return JSON.parse(cfg)
    },
    setConfig: (cfg) => {
        fs.writeFileSync(path.join(dir,".electropack.json"), JSON.stringify(cfg, null, 4))
    },
    readDir: (subdir = "") => {
        let files = {dirs: [], files: []}
        fs.readdirSync(path.join(dir,subdir)).forEach(file => {
            if (fs.statSync(path.join(dir,subdir,file)).isDirectory())
                files.dirs.push(file)
            else
                files.files.push(file)
        })
        ipcRenderer.send('consoleLog', files)
        return files
    }
})