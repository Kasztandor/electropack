const {app, BrowserWindow, ipcMain} = require('electron')

function handleSetTitle(event, x){
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(x)
    console.log(x)
}

console.log(__dirname)

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
    ipcMain.on('channel', handleSetTitle)
    win.webContents.openDevTools()
})