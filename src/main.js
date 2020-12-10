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

ipcMain.on('event1', (event, ...args) => {
  console.log(args)
})

ipcMain.on('event2', (event, ...args) => {
  console.log(args)
  // event.reply('event5', 'hello', 'event5')
  event.sender.send('event5', 'hello', 'event5')
  event.returnValue = args
})

ipcMain.handle('event4', (event, ...args) => {
  console.log(args)
  return args
})

app.whenReady().then(async () => {
  await createWindow()

  mainWin.webContents.send('event3', 'hello', 'event3')
  mainWin.webContents.send('event6', 'hello', 'event6')
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

