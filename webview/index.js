const { ipcRenderer } = require('electron')

ipcRenderer.on('event7', (event, ...args) => {
  console.log(args)
  ipcRenderer.sendToHost('event8', 'hello', 'event8')
})

ipcRenderer.send('event9', 'hello', 'event9')
