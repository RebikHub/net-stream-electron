import { app, BrowserWindow } from 'electron'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import appExpress from './server/app.js'
import { PORT, WEBTORRENT_DOWNLOAD_PATH } from './server/config.js'
import { clearFolder } from './server/utils/clearFolder.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow

appExpress.listen(PORT, () => {
  clearFolder(WEBTORRENT_DOWNLOAD_PATH)
  console.log(`Server is running on port ${PORT}`)
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableBlinkFeatures: 'AudioVideoTracks',
      enableRemoteModule: true,
      backgroundThrottling: false,
      contentSecurityPolicy: "default-src 'self';",
      // contentSecurityPolicy:
      //   "default-src 'self' 'unsafe-inline' 'unsafe-eval';",
      autoplayPolicy: 'no-user-gesture-required',
      webSecurity: true,
      sandbox: false
      // preload: path.join(__dirname, "preload.js"), // Путь к файлу preload.js
    }
  })

  // Создаем директорию, если она не существует
  console.log(fs.existsSync(WEBTORRENT_DOWNLOAD_PATH))

  if (!fs.existsSync(WEBTORRENT_DOWNLOAD_PATH)) {
    fs.mkdirSync(WEBTORRENT_DOWNLOAD_PATH)
  }

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => (mainWindow = null))

  mainWindow.on('enter-full-screen', () => {
    mainWindow.setMenuBarVisibility(false)
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.setMenuBarVisibility(true)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    clearFolder(WEBTORRENT_DOWNLOAD_PATH)
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
