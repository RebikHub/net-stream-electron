import { app, BrowserWindow } from 'electron'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import appExpress from './server/app.js'
import { PORT } from './server/config.js'
import squirrel from 'electron-squirrel-startup'
import { clearFolder } from './server/utils/clearFolder.js'
import { createFolder } from './server/utils/createFolder.js'

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
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    try {
      const files = await fs.readdir(WEBTORRENT_DOWNLOAD_PATH)
      await Promise.all(files.map(file => fs.unlink(path.join(WEBTORRENT_DOWNLOAD_PATH, file))))
      await fs.rmdir(WEBTORRENT_DOWNLOAD_PATH)
    } catch (err) {
      console.error('Ошибка при удалении файлов: ', err)
    } finally {
      app.quit()
    }
  }
})

// Обработка события 'before-quit'
app.on('before-quit', async () => {
  try {
    const files = await fs.readdir(WEBTORRENT_DOWNLOAD_PATH)
    await Promise.all(files.map(file => fs.unlink(path.join(WEBTORRENT_DOWNLOAD_PATH, file))))
  } catch (err) {
    console.error('Ошибка при удалении файлов: ', err)
  }
})

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     fs.readdir(WEBTORRENT_DOWNLOAD_PATH, (err, files) => {
//       if (err) throw err

//       files.forEach(file => {
//         fs.unlink(path.join(WEBTORRENT_DOWNLOAD_PATH, file), err => {
//           if (err) throw err
//           console.log(`${file} deleted successfully!`)
//         })
//       })
//       clearFolder(WEBTORRENT_DOWNLOAD_PATH)
//     })
//     app.quit()
//   }
// })

// app.on('ready', createWindow)

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     fs.readdir(WEBTORRENT_DOWNLOAD_PATH, (err, files) => {
//       if (err) {
//         console.error(`Ошибка при чтении содержимого папки ${WEBTORRENT_DOWNLOAD_PATH}:`, err)
//         return
//       }

//       files.forEach(file => {
//         fs.unlink(path.join(WEBTORRENT_DOWNLOAD_PATH, file), err => {
//           if (err) {
//             console.error(`Ошибка при удалении файла ${file}:`, err)
//           } else {
//             console.log(`${file} deleted successfully!`)
//           }
//         })
//       })

//       fs.emptyDir(WEBTORRENT_DOWNLOAD_PATH, (err) => {
//         if (err) {
//           console.error(
//             `Ошибка при очистке содержимого папки ${WEBTORRENT_DOWNLOAD_PATH}:`,
//             err
//           )
//         } else {
//           console.log(`Содержимое папки ${WEBTORRENT_DOWNLOAD_PATH} успешно очищено.`)
//         }
//       })
//     })

//     app.quit()
//   }
// })

// app.on('before-quit', () => {
//   fs.readdir(WEBTORRENT_DOWNLOAD_PATH, (err, files) => {
//     if (err) throw err

//     files.forEach(file => {
//       fs.unlink(path.join(WEBTORRENT_DOWNLOAD_PATH, file), err => {
//         if (err) throw err
//         console.log(`${file} deleted successfully!`)
//       })
//     })
//     clearFolder(WEBTORRENT_DOWNLOAD_PATH)
//   })
// })
