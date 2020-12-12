const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWin

async function createWindow () {
  mainWin = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: true,
      webviewTag: true,
      enableRemoteModule: true
    }
  })

  await mainWin.loadFile(path.resolve(__dirname, '../public/index.html'))

  mainWin.openDevTools()
}

app.whenReady().then(async () => {
  await createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})
