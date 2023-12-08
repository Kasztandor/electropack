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
    setConfig: (cfg) => {
        fs.writeFileSync(path.join(dir,".electropack.json"), JSON.stringify(cfg, null, 4))
    },
    loadConfig: () => {
        let confFile = path.join(dir,".electropack.json")
        if (!fs.existsSync(confFile)){
            const cfg = {
                oppenedDirs: [],
                oppenedTab: "visualEditor"
            }
            fs.writeFileSync(confFile, JSON.stringify(cfg, null, 4))
            return cfg
        }
        let cfg = JSON.parse(fs.readFileSync(confFile, "utf-8"))
        if (cfg.oppenedDirs == undefined)
            cfg.oppenedDirs = []
        else
            cfg.oppenedDirs = cfg.oppenedDirs.filter(e => fs.existsSync(path.join(dir,e)))
        if (cfg.oppenedTab == undefined)
            cfg.oppenedTab = "visualEditor"
        return cfg
    },
    readDir: (subdir = "") => {
        let files = {dirs: [], files: []}
        fs.readdirSync(path.join(dir,subdir)).forEach(file => {
            if (fs.statSync(path.join(dir,subdir,file)).isDirectory())
                files.dirs.push(file)
            else
                files.files.push(file)
        })
        return files
    }
})