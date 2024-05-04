import { app, BrowserWindow } from 'electron'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import appExpress from './server/app.js'
import { PORT } from './server/config.js'
import squirrel from 'electron-squirrel-startup'
import { clearFolder } from './server/utils/clearFolder.js'
import { createFolder } from './server/utils/createFolder.js'
import { destroyTorrentClient } from './server/controllers/video/torrentController.js'
import { clearBaseUrl } from './server/utils/getBaseUrl.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow

export const WEBTORRENT_DOWNLOAD_PATH = createFolder()

appExpress.listen(PORT, () => {
  clearFolder(WEBTORRENT_DOWNLOAD_PATH)
  console.log(`Server is running on port ${PORT}`)
})

if (squirrel) {
  app.quit()
}

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

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => (mainWindow = null))

  mainWindow.on('enter-full-screen', () => {
    mainWindow.setMenuBarVisibility(false)
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.setMenuBarVisibility(true)
  })
}

// Обработка события 'ready'
app.whenReady().then(createWindow)

// Обработка события 'activate'
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Обработка события 'window-all-closed'
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    try {
      destroyTorrentClient()
    } catch (err) {
      console.error('Ошибка при удалении файлов: ', err)
    } finally {
      clearBaseUrl()
      app.quit()
    }
  }
})

// Обработка события 'before-quit'
app.on('before-quit', () => {
  try {
    destroyTorrentClient()
  } catch (err) {
    console.error('Ошибка при удалении файлов: ', err)
  } finally {
    clearBaseUrl()
  }
})
