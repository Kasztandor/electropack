const {app, BrowserWindow, ipcMain} = require('electron')

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname+'/site/editorPreload.js'
        }
    })
    win.setMenuBarVisibility(false)
    win.loadFile('site/editor.html')
    ipcMain.on('devtools', () => {
        win.webContents.openDevTools()
    })
    ipcMain.on('consoleLog', (event, arg) => {
        console.log(arg)
    })
})