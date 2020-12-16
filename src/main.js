const { app, BrowserWindow, protocol } = require('electron')
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

function registerProtocol (protocol) {
  app.removeAsDefaultProtocolClient(protocol)

  if (process.platform === 'win32') { // window 环境下要做兼容
    app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])])
  } else {
    app.setAsDefaultProtocolClient(protocol)
  }
}

function appInstanceLock () {
  const lock = app.requestSingleInstanceLock()
  if (!lock) {
    app.quit()
  } else {
    app.on('second-instance', (event, argv) => {
      if (mainWin.minimizable) {
        mainWin.restore()
      }

      if (mainWin.isVisible()) {
        mainWin.show()
      }

      console.log(argv)
    })
  }
}

function registerFileProtocol (scheme) {
  protocol.registerFileProtocol(scheme, (request, callback) => {
    const url = request.url.slice(scheme.length + 3)
    callback({ path: path.resolve(__dirname, '../', url) })
  })
}

app.whenReady().then(async () => {
  registerProtocol('huang')
  appInstanceLock()
  registerFileProtocol('kui')
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
