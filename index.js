const {app, BrowserWindow} = require('electron')

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: true}
    })
    win.setMenuBarVisibility(false)
    win.loadFile('site/editor.html')
})